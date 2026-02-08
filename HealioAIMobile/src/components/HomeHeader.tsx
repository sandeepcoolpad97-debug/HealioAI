import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';

type HomeHeaderProps = {
    userName?: string;
    userAvatar?: string;
    onNotificationPress?: () => void;
    onProfilePress?: () => void;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({
    userName = 'User',
    userAvatar,
    onNotificationPress,
    onProfilePress,
}) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={onProfilePress}
                    activeOpacity={0.7}>
                    {userAvatar ? (
                        <Image source={{ uri: userAvatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Icon name="person" size={24} color={colors.primaryBlue} />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                    <Text style={styles.userName}>{userName}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.notificationButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}>
                <Icon name="notifications-outline" size={24} color={colors.primaryText} />
                {/* Optional notification badge */}
                <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>3</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.backgroundLight,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.backgroundOnboardingTwo,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primaryBlue,
    },
    greetingContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: colors.secondaryText,
        marginBottom: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primaryText,
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
        top: 4,
        right: 4,
        backgroundColor: '#EF4444',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
});
