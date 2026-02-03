import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 20;
const CARD_WIDTH = (width - (PADDING * 2) - GAP) / 2;

export const AIHealthServices: React.FC = () => {
    const services = [
        { id: 1, title: 'Symptom Analyzer', icon: 'medkit-outline' },
        { id: 2, title: 'Prescription Analyzer', icon: 'document-text-outline' },
        { id: 3, title: 'X-Ray Analyzer', icon: 'scan-outline' },
        { id: 4, title: 'Health History', icon: 'time-outline' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>AI Health Services</Text>
            <View style={styles.gridContainer}>
                {services.map((service) => (
                    <TouchableOpacity key={service.id} style={styles.card} activeOpacity={0.8}>
                        <View style={styles.iconContainer}>
                            <Icon name={service.icon} size={28} color="#4CAF50" />
                        </View>
                        <Text style={styles.cardTitle}>{service.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0A5FB4', // Matching the design blue
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        // Shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E8F5E9', // Light green bg
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0A5FB4',
        textAlign: 'center',
        lineHeight: 20,
    },
});
