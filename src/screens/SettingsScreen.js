// src/screens/SettingsScreen.js
// Settings screen with cloud backup controls
// Author: thethirdapprentice

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { backupToCloud, restoreFromCloud, getLastBackupInfo } from '../services/backupService';
import { getCurrentUser, logoutUser } from '../services/authService';
import { clearCurrentUserExpenses } from '../services/expenseService';

export default function SettingsScreen() {
  const [lastBackup, setLastBackup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadBackupInfo();
    }, [])
  );

  const loadBackupInfo = async () => {
    const info = await getLastBackupInfo();
    setLastBackup(info);
    const u = getCurrentUser();
    if (u) {
      setUserInfo({
        name: u.displayName || null,
        email: u.email || null,
      });
    } else {
      setUserInfo(null);
    }
  };

  const handleBackup = async () => {
    Alert.alert(
      'Backup to Cloud',
      'This will backup all your expenses to the cloud. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Backup',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await backupToCloud();
              setLoading(false);
              Alert.alert(
                'Backup Successful! ✅',
                `${result.count} expenses backed up to cloud.`
              );
              await loadBackupInfo();
            } catch (error) {
              setLoading(false);
              Alert.alert('Backup Failed', error.message);
            }
          }
        }
      ]
    );
  };

  const handleRestore = async () => {
    Alert.alert(
      'Restore from Cloud',
      '⚠️ This will REPLACE all local expenses with your cloud backup. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await restoreFromCloud();
              setLoading(false);
              Alert.alert(
                'Restore Successful! ✅',
                `${result.count} expenses restored from cloud.`
              );
            } catch (error) {
              setLoading(false);
              Alert.alert('Restore Failed', error.message);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Do you want to logout and switch account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
            } catch (e) {
              Alert.alert('Logout Failed', e.message || 'Please try again');
            }
          }
        }
      ]
    );
  };

  const handleResetLocalData = async () => {
    Alert.alert(
      'Reset Local Data',
      'This will delete ALL local expenses for the current account on this device only. Cloud backups are not affected. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await clearCurrentUserExpenses();
              setLoading(false);
              Alert.alert('Done', 'Local expenses deleted for this account.');
            } catch (e) {
              setLoading(false);
              Alert.alert('Failed', e.message || 'Please try again');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {userInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Text style={styles.infoValue}>
              {userInfo.name ? `${userInfo.name}` : 'Logged in'}
            </Text>
            {userInfo.email && (
              <Text style={styles.infoCount}>{userInfo.email}</Text>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetLocalData}>
              <Text style={styles.resetText}>🗑️ Reset Local Data (This User)</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cloud Backup</Text>
          <Text style={styles.sectionSubtitle}>
            Backup your expenses to the cloud and restore them on any device
          </Text>

          {lastBackup && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Last Backup:</Text>
              <Text style={styles.infoValue}>{lastBackup.date}</Text>
              <Text style={styles.infoCount}>{lastBackup.count} expenses</Text>
            </View>
          )}

          {!lastBackup && (
            <View style={styles.infoBox}>
              <Text style={styles.infoValue}>No cloud backup found</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleBackup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>☁️ Backup to Cloud</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRestore}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#4CAF50" />
            ) : (
              <Text style={styles.secondaryButtonText}>📥 Restore from Cloud</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Expense Tracker v1.0{'\n'}
            Offline-first expense tracking with cloud backup
          </Text>
        </View>

        <View style={styles.featureBox}>
          <Text style={styles.featureTitle}>📱 Offline-First</Text>
          <Text style={styles.featureText}>
            All expenses are stored locally on your device. Works without internet!
          </Text>
        </View>

        <View style={styles.featureBox}>
          <Text style={styles.featureTitle}>☁️ Cloud Backup</Text>
          <Text style={styles.featureText}>
            Optional cloud backup keeps your data safe and synced across devices.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#9E9E9E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetText: {
    color: '#616161',
    fontSize: 14,
    fontWeight: 'bold',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featureBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
  },
});