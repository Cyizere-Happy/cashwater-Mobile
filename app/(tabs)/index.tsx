import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-gifted-charts';
import * as Location from 'expo-location';
import { endpoints } from '@/constants/api';
import { useMQTT } from '@/hooks/useMQTT';

const { width } = Dimensions.get('window');

// Hardcoded device ID from AsyncStorage / registration flow
// In a real app this comes from stored registration data
const REGISTERED_DEVICE_ID = 'CW-DEMO01';

export default function DashboardScreen() {
  const {
    isConnected,
    flowRate,
    totalVolume,
    valveState,
    leakDetected,
    anomalyScore,
    sendValveCommand,
    sendAnomalyScan,
  } = useMQTT();

  const [activeTab, setActiveTab] = useState('Overview');

  // Reporting Form State
  const [reportDescription, setReportDescription] = useState('');
  const [reportSeverity, setReportSeverity] = useState('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const chartData = [
    { value: 120, label: 'Mon' },
    { value: 145, label: 'Tue' },
    { value: 130, label: 'Wed' },
    { value: 155, label: 'Thu' },
    { value: 140, label: 'Fri' },
    { value: totalVolume || 0, label: 'Sat', frontColor: Colors.primary }, // Highlight today with live data
    { value: 0, label: 'Sun' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Block */}
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu-outline" size={28} color={Colors.secondary} />
        </TouchableOpacity>

        <Text style={styles.logoText}>
          CashWater<Text style={styles.logoDot}>.</Text>
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10B981' : '#EF4444' }]} />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pill Navigation */}
      <View style={styles.pillContainer}>
        {['Overview', 'Tasks', 'Alerts', 'Report'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={activeTab === tab ? styles.pillActive : styles.pillInactive}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={activeTab === tab ? styles.pillActiveText : styles.pillInactiveText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Card ("Your Dashboard") */}
        <View style={styles.section}>
          <Text style={styles.heroTitle}>Your Dashboard</Text>
          <View style={styles.darkCard}>
            <View style={styles.darkCardHeader}>
              <View>
                <Text style={styles.darkCardSubtitle}>Total Consumption</Text>
                <Text style={styles.darkCardValue}>
                  <Text style={styles.darkCardAccent}>{totalVolume?.toFixed(1) || '0.0'}</Text> Litres
                </Text>
              </View>
              <View>
                <Text style={styles.darkCardSubtitle}>Rate</Text>
                <Text style={styles.darkCardSubvalue}>{flowRate?.toFixed(1) || '0.0'} L/min</Text>
              </View>
              <View>
                <Text style={styles.darkCardSubtitle}>Status</Text>
                <Text style={[styles.darkCardSubvalue, { color: leakDetected ? '#EF4444' : '#10B981' }]}>
                  {leakDetected ? 'LEAK' : valveState || 'OPEN'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => sendAnomalyScan('TRIGGER')}>
                <Ionicons name="scan-outline" size={20} color={anomalyScore > 0 ? '#EF4444' : Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.darkCardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonActive]}>
                <Text style={[styles.actionButtonText, styles.actionButtonTextActive]}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Conditional Content based on Active Tab */}
        {activeTab === 'Overview' && (
          <View style={styles.section}>
            <Text style={styles.chartTitle}>Weekly Overview</Text>
            <View style={styles.chartCard}>
              <BarChart
                data={chartData}
                barWidth={18}
                spacing={25}
                roundedTop
                roundedBottom
                hideRules
                hideYAxisText
                yAxisThickness={0}
                xAxisThickness={0}
                xAxisLabelTextStyle={{ color: '#A0A0A0', fontSize: 11, fontWeight: '500' }}
                noOfSections={4}
                maxValue={200}
                frontColor={'#E8EEF5'}
                isAnimated={Platform.OS !== 'web'}
              />
            </View>
          </View>
        )}

        {activeTab === 'Alerts' && (
          <View style={styles.section}>
            <Text style={styles.gridTitle}>Security & Alerts</Text>

            {/* Real-time Leak Alert if detected by firmware */}
            {leakDetected && (
              <View style={styles.alertCard}>
                <View style={styles.alertIconBox}>
                  <Ionicons name="warning" size={24} color="#EF4444" />
                </View>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>Hardware Anomaly Detected</Text>
                  <Text style={styles.alertDesc}>
                    Critical leak probability ({anomalyScore}%). Unusual flow patterns detected by the ESP32.
                  </Text>
                  <TouchableOpacity
                    style={[styles.supplyButtonBlock, { marginTop: 8 }]}
                    onPress={() => sendAnomalyScan('ACKNOWLEDGE')}
                  >
                    <Text style={styles.supplyButtonBlockText}>Acknowledge & Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Standard notification cards (static placeholder) */}
            <View style={[styles.alertCard, { opacity: 0.8 }]}>
              <View style={[styles.alertIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="water" size={24} color="#F59E0B" />
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertTitle}>Usage Threshold Warning</Text>
                <Text style={styles.alertDesc}>You are approaching your daily limit preset. 90% consumed.</Text>
                <Text style={styles.alertTime}>2 hours ago</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Report' && (
          <View style={styles.section}>
            <Text style={styles.gridTitle}>Report a Leak</Text>

            {!showSuccess ? (
              <View style={styles.reportForm}>
                {/* Info box */}
                <View style={styles.reportInfoBox}>
                  <Ionicons name="warning-outline" size={18} color="#F59E0B" />
                  <Text style={styles.reportInfoText}>
                    Reports are sent directly to WASAC administrators and include your current location.
                  </Text>
                </View>

                <Text style={styles.inputLabel}>Severity Level</Text>
                <View style={styles.severityPicker}>
                  {['LOW', 'MEDIUM', 'HIGH'].map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.severityButton,
                        reportSeverity === s && styles.severityButtonActive,
                        reportSeverity === s && s === 'HIGH' && { backgroundColor: '#EF4444' },
                        reportSeverity === s && s === 'MEDIUM' && { backgroundColor: '#F59E0B' },
                        reportSeverity === s && s === 'LOW' && { backgroundColor: Colors.primary },
                      ]}
                      onPress={() => setReportSeverity(s)}
                    >
                      <Text style={[styles.severityText, reportSeverity === s && { color: '#FFF' }]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Description</Text>
                <View style={[styles.inputWrapper, { alignItems: 'flex-start', paddingTop: 12, minHeight: 100 }]}>
                  <Ionicons name="chatbubble-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.inputText, { flex: 1, textAlignVertical: 'top', minHeight: 70 }]}
                    placeholder="Describe the leak or problem in detail..."
                    placeholderTextColor="#AAA"
                    value={reportDescription}
                    onChangeText={setReportDescription}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, (!reportDescription || isSubmitting) && { opacity: 0.7 }]}
                  disabled={!reportDescription || isSubmitting}
                  onPress={async () => {
                    if (!reportDescription.trim()) {
                      Alert.alert('Missing Info', 'Please describe the issue before submitting.');
                      return;
                    }
                    setIsSubmitting(true);
                    try {
                      let latitude: number | undefined;
                      let longitude: number | undefined;

                      // Try to get GPS location
                      const { status } = await Location.requestForegroundPermissionsAsync();
                      if (status === 'granted') {
                        const loc = await Location.getCurrentPositionAsync({
                          accuracy: Location.Accuracy.Balanced,
                        });
                        latitude = loc.coords.latitude;
                        longitude = loc.coords.longitude;
                      }

                      const payload = {
                        deviceId: REGISTERED_DEVICE_ID,
                        severity: reportSeverity,
                        description: reportDescription,
                        ...(latitude !== undefined ? { latitude } : {}),
                        ...(longitude !== undefined ? { longitude } : {}),
                      };

                      const response = await fetch(endpoints.submitReport, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });

                      if (response.ok) {
                        setShowSuccess(true);
                        setReportDescription('');
                        setReportSeverity('MEDIUM');
                      } else {
                        const data = await response.json();
                        Alert.alert('Submission Failed', data.message || 'Could not send report. Please try again.');
                      }
                    } catch (error) {
                      // If backend is unavailable, still show success to user (offline-friendly)
                      console.error('Report submission error:', error);
                      Alert.alert(
                        'Connection Issue',
                        'Could not reach the server. Please check your network and try again.'
                      );
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting
                    ? <ActivityIndicator color="#FFF" size="small" />
                    : <Text style={styles.submitButtonText}>Send Report to WASAC</Text>
                  }
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.successView}>
                <View style={styles.successIconBox}>
                  <Ionicons name="checkmark-circle" size={50} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>Report Sent Successfully</Text>
                <Text style={styles.successDesc}>WASAC administrators have been notified of the leak. A technician will be dispatched if necessary.</Text>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setShowSuccess(false);
                    setActiveTab('Overview');
                  }}
                >
                  <Text style={styles.backButtonText}>Back to Dashboard</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Grid Section ("Your Devices") */}
        <View style={styles.section}>
          <Text style={styles.gridTitle}>Your Devices</Text>
          <View style={styles.devicesGrid}>

            {/* Device Card 1 (Connected to Hardware) */}
            <View style={styles.gridCard}>
              <View style={styles.gridCardHeader}>
                <Ionicons name={valveState === 'BLOCKED' ? "water-outline" : "water"} size={26} color={valveState === 'BLOCKED' ? '#EF4444' : Colors.primary} />
                <View style={[styles.trendBadge, valveState === 'BLOCKED' && { backgroundColor: '#FEF2F2' }]}>
                  <Text style={[styles.trendTextPositive, valveState === 'BLOCKED' && { color: '#EF4444' }]}>
                    {valveState || 'Active'}
                  </Text>
                </View>
              </View>
              <Text style={styles.gridCardName}>Main Valve</Text>
              <Text style={styles.gridCardSub}>Kitchen System</Text>
              <TouchableOpacity
                style={valveState === 'BLOCKED' ? styles.supplyButtonUnblock : styles.supplyButtonBlock}
                onPress={() => sendValveCommand(valveState === 'BLOCKED' ? 'OPEN' : 'BLOCKED')}
              >
                <Text style={valveState === 'BLOCKED' ? styles.supplyButtonUnblockText : styles.supplyButtonBlockText}>
                  {valveState === 'BLOCKED' ? 'Unblock Supply' : 'Block Supply'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Device Card 2 (Secondary Mock) */}
            <View style={styles.gridCard}>
              <View style={styles.gridCardHeader}>
                <Ionicons name="flower" size={26} color={Colors.primary} />
                <View style={styles.trendBadge}>
                  <Text style={styles.trendTextPositive}>Active</Text>
                </View>
              </View>
              <Text style={styles.gridCardName}>Sprinkler</Text>
              <Text style={styles.gridCardSub}>Garden System</Text>
              <TouchableOpacity style={styles.supplyButtonBlock}>
                <Text style={styles.supplyButtonBlockText}>Block Supply</Text>
              </TouchableOpacity>
            </View>

            {/* Add Device Card */}
            <TouchableOpacity style={styles.gridCardAdd}>
              <Text style={styles.gridCardAddText}>Add Device</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Ultra clean off-white
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  menuButton: {
    padding: 5,
  },
  searchButton: {
    padding: 5,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1E24',
    letterSpacing: -0.5,
  },
  logoDot: {
    color: Colors.primary, // #396cb8 dot
  },
  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 30,
    marginHorizontal: 20,
    padding: 3,
    marginBottom: 10,
  },
  pillActive: {
    backgroundColor: '#2D2D35', // Deep slate active pill
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pillActiveText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  pillInactive: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    alignItems: 'center',
  },
  pillInactiveText: {
    color: '#888',
    fontWeight: '500',
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E24',
    marginBottom: 10,
    marginHorizontal: 5,
  },
  darkCard: {
    backgroundColor: '#1E1E24',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  darkCardSubtitle: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  darkCardValue: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  darkCardAccent: {
    color: Colors.primary, // #396cb8
    fontSize: 20,
  },
  darkCardSubvalue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  darkCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2D2D35',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#353540',
    borderWidth: 1,
    borderColor: '#444455',
  },
  actionButtonText: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#FFF',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E24',
    marginBottom: 10,
    marginHorizontal: 5,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E24',
    marginBottom: 10,
    marginHorizontal: 5,
    marginTop: 5,
  },
  devicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 4,
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trendBadge: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trendTextPositive: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '700',
  },
  trendTextNegative: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700',
  },
  gridCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1E24',
    marginBottom: 3,
  },
  gridCardSub: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  gridCardAdd: {
    width: '48%',
    backgroundColor: '#F5F5FA',
    borderRadius: 16,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 130,
    marginBottom: 4,
  },
  gridCardAddText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  supplyButtonBlock: {
    marginTop: 10,
    backgroundColor: '#FEF2F2',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  supplyButtonBlockText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
  },
  supplyButtonUnblock: {
    marginTop: 10,
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  supplyButtonUnblockText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'flex-start',
  },
  alertIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1E24',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 6,
  },
  alertTime: {
    fontSize: 11,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  reportForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  reportInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reportInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E1E24',
    marginBottom: 8,
    marginTop: 15,
  },
  severityPicker: {
    flexDirection: 'row',
    gap: 10,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5FA',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  severityButtonActive: {
    borderColor: 'transparent',
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E24',
    marginBottom: 10,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  backButton: {
    backgroundColor: '#F5F5FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
