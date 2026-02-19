import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

type HomeHeaderProps = {
    userName?: string;
    location?: string;
    onNotificationPress?: () => void;
    onSearchPress?: () => void;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({
    userName = 'Sandeep',
    location = 'Bengaluru, India',
    onNotificationPress,
    onSearchPress,
}) => {
    return (
        <View style={styles.container}>
            {/* Blue Background Section */}
            <View style={styles.headerBackground}>
                <View style={styles.topRow}>
                    <View style={styles.greetingWrapper}>
                        <Text style={styles.greetingText}>
                            Hello, {userName} <Text style={styles.handEmoji}>👋</Text>
                        </Text>
                        <TouchableOpacity 
                            style={styles.notificationButton} 
                            onPress={onNotificationPress}
                            activeOpacity={0.7}
                        >
                            <Icon name="notifications-outline" size={24} color="#FFFFFF" />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.subtitleText}>Here's your health overview today</Text>
                    <Text style={styles.locationText}>{location}</Text>
                </View>
            </View>

            {/* Floating Search Bar */}
            <View style={styles.searchContainerWrapper}>
                <TouchableOpacity 
                    style={styles.searchContainer} 
                    onPress={onSearchPress}
                    activeOpacity={1} 
                >
                    <Icon name="search-outline" size={20} color={colors.primaryBlue} style={styles.searchIcon} />
                    <Text style={styles.searchPlaceholder}>Search doctors, labs, reports...</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundLight,
    },
    headerBackground: {
        backgroundColor: colors.signInBackground, // Using the deep blue
        paddingHorizontal: 20,
        paddingTop: 40, // Status bar spacing
        paddingBottom: 40, // Space for the search bar overlap
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    topRow: {
        marginBottom: 10,
    },
    greetingWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    greetingText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    handEmoji: {
        fontSize: 22,
    },
    subtitleText: {
        fontSize: 16,
        color: '#E0E0E0',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#B0C4DE', // Lighter blue/grey
    },
    notificationButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#4CAF50', // Green dot
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    searchContainerWrapper: {
        marginTop: -25, // Negative margin to pull it up
        paddingHorizontal: 20,
    },
    searchContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4, // Android shadow
    },
    searchIcon: {
        marginRight: 10,
    },
    searchPlaceholder: {
        fontSize: 14,
        color: '#9CA3AF', // Gray text
        flex: 1,
    },
});
