import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsCard({ title, value, subtitle, color = '#4CAF50', alert = false }) {
  return (
    <View style={[styles.card, alert && styles.alertCard]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color: alert ? '#f44336' : color }]}>
        ${value.toFixed(2)}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {alert && (
        <View style={styles.alertBadge}>
          <Text style={styles.alertText}>⚠️ Above Average</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertCard: {
    borderWidth: 2,
    borderColor: '#f44336',
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
  },
  alertBadge: {
    backgroundColor: '#ffebee',
    padding: 6,
    borderRadius: 5,
    marginTop: 8,
  },
  alertText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
});