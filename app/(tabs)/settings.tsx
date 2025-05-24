import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Bell, Moon, CreditCard, Tag, CircleHelp as HelpCircle, LogOut, ChevronRight, Shield } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import Header from '@/components/common/Header';
import { useBudget } from '@/context/BudgetContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { resetBudget } = useBudget();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  
  const toggleDarkMode = () => setDarkMode(previous => !previous);
  const toggleNotifications = () => setNotifications(previous => !previous);
  
  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to reset all your budget data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset", 
          onPress: () => resetBudget(),
          style: "destructive"
        }
      ]
    );
  };
  
  const renderSettingItem = (icon, title, right = null, onPress = () => {}, isLast = false) => (
    <Pressable 
      onPress={onPress}
      style={[styles.settingItem, isLast && styles.lastSettingItem]}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
      <View style={styles.settingRight}>
        {right || <ChevronRight size={20} color={colors.textSecondary} />}
      </View>
    </Pressable>
  );
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Settings" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            {renderSettingItem(
              <User size={20} color={colors.primary} />,
              "Account Settings"
            )}
            {renderSettingItem(
              <Bell size={20} color={colors.primary} />,
              "Notifications",
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notifications ? colors.primary : colors.textSecondary}
              />,
              toggleNotifications,
              true
            )}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            {renderSettingItem(
              <Moon size={20} color={colors.primary} />,
              "Dark Mode",
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={darkMode ? colors.primary : colors.textSecondary}
              />,
              toggleDarkMode
            )}
            {renderSettingItem(
              <CreditCard size={20} color={colors.primary} />,
              "Payment Methods"
            )}
            {renderSettingItem(
              <Tag size={20} color={colors.primary} />,
              "Categories",
              null,
              () => {},
              true
            )}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(300)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            {renderSettingItem(
              <HelpCircle size={20} color={colors.primary} />,
              "Help & Support"
            )}
            {renderSettingItem(
              <Shield size={20} color={colors.primary} />,
              "Privacy Policy",
              null,
              () => {},
              true
            )}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(300)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data</Text>
            <Pressable
              style={[styles.settingItem, styles.lastSettingItem, styles.dangerItem]}
              onPress={handleResetData}
            >
              <View style={styles.settingIconContainer}>
                <LogOut size={20} color={colors.error} />
              </View>
              <Text style={[styles.settingTitle, styles.dangerText]}>Reset All Data</Text>
            </Pressable>
          </View>
        </Animated.View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
  },
  settingRight: {
    alignItems: 'flex-end',
  },
  dangerItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  dangerText: {
    color: colors.error,
  },
});