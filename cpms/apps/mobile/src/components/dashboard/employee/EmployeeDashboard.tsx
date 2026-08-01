import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Dimensions, Modal, Switch } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useAuthStore } from '../../../core/authStore';
import { format } from 'date-fns';
import { 
  Clock, Calendar, IndianRupee, ShieldAlert, Activity, 
  Target, CheckCircle2, Building2, MapPin, Sun, Moon, Contact, Users, LogOut, Bell, Settings, X, Monitor, ChevronRight, Menu
} from 'lucide-react-native';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function EmployeeDashboard() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const navigation = useNavigation();

  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleNotifications = () => {
    if (Platform.OS === 'web') alert('Notifications coming soon');
  };

  const toggleTheme = () => {
    toggleColorScheme();
  };

  const userName = user?.name || "Employee";

  // Shared colors
  const brandPrimary = '#FF6B35';
  const colorSuccess = '#10B981';
  const colorWarning = '#F59E0B';
  const colorDanger = '#EF4444';
  const colorInfo = '#3B82F6';
  
  const bgApp = isDark ? '#05070A' : '#F8FAFC';
  const bgCard = isDark ? 'rgba(15, 23, 42, 0.6)' : '#FFFFFF';
  const borderCard = isDark ? 'rgba(30, 41, 59, 0.8)' : '#E2E8F0';
  const textTitle = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  
  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: bgApp }}
      contentContainerStyle={{ padding: 20, paddingTop: Platform.OS === 'ios' ? 70 : 30, paddingBottom: 100 }}
    >
      {/* HEADER SECTION */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ marginRight: 12, padding: 4 }}
            >
              <Menu size={24} color={textTitle} />
            </TouchableOpacity>
            <Text style={{ fontSize: 14, fontWeight: '700', color: textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {format(new Date(), 'EEEE, MMM do')}
            </Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: '900', color: textTitle, lineHeight: 38, letterSpacing: -1 }}>
            Good Morning,
          </Text>
          <Text style={{ fontSize: 32, fontWeight: '900', color: brandPrimary, lineHeight: 38, letterSpacing: -1 }}>
            {userName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity 
            onPress={handleNotifications}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}
          >
            <Bell size={20} color={textTitle} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSettings}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}
          >
            <Settings size={20} color={textTitle} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleLogout} 
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}
          >
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* STATUS PILLS */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E293B' : '#F1F5F9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999 }}>
          <MapPin size={16} color={brandPrimary} />
          <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '700', color: textTitle }}>Skyline Tower A</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E293B' : '#F1F5F9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999 }}>
          <Sun size={16} color={colorWarning} />
          <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '700', color: textTitle }}>28°C Clear</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999 }}>
          <Clock size={16} color={colorInfo} />
          <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '700', color: colorInfo }}>Morning Shift</Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={{ fontSize: 18, fontWeight: '800', color: textTitle, marginBottom: 16, letterSpacing: -0.5 }}>Quick Actions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 }}>
        
        <TouchableOpacity style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 12, elevation: 2 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Clock size={28} color={colorSuccess} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle }}>Attendance</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: textMuted, marginTop: 4 }}>Clock in/out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 12, elevation: 2 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Calendar size={28} color={colorWarning} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle }}>Leave</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: textMuted, marginTop: 4 }}>Request time off</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 12, elevation: 2 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? 'rgba(255, 107, 53, 0.15)' : '#FFF7ED', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <IndianRupee size={28} color={brandPrimary} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle }}>Payslip</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: textMuted, marginTop: 4 }}>View salary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 12, elevation: 2 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <ShieldAlert size={28} color={colorDanger} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle }}>Emergency</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: textMuted, marginTop: 4 }}>Alert manager</Text>
        </TouchableOpacity>

      </View>

      <View style={{ flexDirection: 'column', gap: 20 }}>
        
        {/* ATTENDANCE SUMMARY CARD */}
        <View style={{ backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
          <View style={{ padding: 24, borderBottomWidth: 1, borderColor: borderCard, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Clock size={18} color={colorSuccess} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>Attendance</Text>
            </View>
            <View style={{ backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9999 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#10B981' }}>PRESENT</Text>
            </View>
          </View>
          
          <View style={{ padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1, borderColor: borderCard, paddingBottom: 24, marginBottom: 24 }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Clock In</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 36, fontWeight: '900', color: textTitle, letterSpacing: -1 }}>08:45</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: textMuted, marginLeft: 4 }}>AM</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Clock Out</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 36, fontWeight: '900', color: textMuted, letterSpacing: -1 }}>--:--</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: textMuted, marginLeft: 4 }}>PM</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderWidth: 1, borderColor: borderCard }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Activity size={20} color={brandPrimary} />
                <Text style={{ fontSize: 15, fontWeight: '800', color: textTitle, marginLeft: 12 }}>Working Hours</Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: '900', color: brandPrimary }}>4h 15m</Text>
            </View>
          </View>
        </View>

        {/* TODAY'S TASKS CARD */}
        <View style={{ backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
          <View style={{ padding: 24, borderBottomWidth: 1, borderColor: borderCard, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <CheckCircle2 size={18} color={colorSuccess} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>Today's Tasks</Text>
            </View>
            <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9999 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: textMuted }}>3 LEFT</Text>
            </View>
          </View>
          
          <View style={{ padding: 24, gap: 16 }}>
            {/* Task 1 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderWidth: 1, borderColor: borderCard, opacity: 0.6 }}>
              <CheckCircle2 size={28} color={colorSuccess} />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: textMuted, textDecorationLine: 'line-through' }}>Unload Cement</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Clock size={12} color={textMuted} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginLeft: 6 }}>09:00 AM</Text>
                </View>
              </View>
            </View>

            {/* Task 2 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderLeftWidth: 6, borderLeftColor: colorWarning, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
              <Clock size={28} color={colorWarning} />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>Lay Foundation B</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Clock size={12} color={brandPrimary} />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: brandPrimary, marginLeft: 6 }}>11:30 AM</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* EARNINGS CARD */}
        <View style={{ backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
          <View style={{ padding: 24, borderBottomWidth: 1, borderColor: borderCard, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <IndianRupee size={18} color={colorWarning} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>Earnings Snapshot</Text>
            </View>
            <View style={{ backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9999 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: colorWarning }}>PROCESSING</Text>
            </View>
          </View>
          
          <View style={{ padding: 24 }}>
            <View style={{ alignItems: 'center', borderBottomWidth: 1, borderColor: borderCard, paddingBottom: 24, marginBottom: 24 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Today's Wage</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 32, fontWeight: '700', color: brandPrimary, opacity: 0.8, marginRight: 4 }}>₹</Text>
                <Text style={{ fontSize: 56, fontWeight: '900', color: brandPrimary, letterSpacing: -2 }}>850</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderWidth: 1, borderColor: borderCard, marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: textMuted }}>Weekly Accrued</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: textTitle }}>₹5,100</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 16, backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5', borderWidth: 1, borderColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5' }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: colorSuccess }}>Monthly Est.</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: colorSuccess }}>₹23,450</Text>
            </View>
          </View>
        </View>

        {/* ASSIGNED PROJECT */}
        <View style={{ backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
          <View style={{ padding: 24, borderBottomWidth: 1, borderColor: borderCard, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? 'rgba(255, 107, 53, 0.2)' : '#FFF7ED', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Building2 size={18} color={brandPrimary} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>Assigned Project</Text>
          </View>
          
          <View style={{ padding: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: brandPrimary, alignItems: 'center', justifyContent: 'center', marginRight: 16, shadowColor: brandPrimary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                <Building2 size={32} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: textTitle, letterSpacing: -0.5, marginBottom: 4 }}>Skyline Tower A</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MapPin size={14} color={textMuted} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: textMuted, marginLeft: 6 }}>Andheri East, Mumbai</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '48%', padding: 16, borderRadius: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderWidth: 1, borderColor: borderCard }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Contact size={18} color={textMuted} />
                </View>
                <Text style={{ fontSize: 11, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Manager</Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: textTitle }}>Rajesh Kumar</Text>
              </View>

              <View style={{ width: '48%', padding: 16, borderRadius: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderWidth: 1, borderColor: borderCard }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Target size={18} color={colorInfo} />
                </View>
                <Text style={{ fontSize: 11, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Phase</Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: colorInfo }}>Foundation</Text>
              </View>
            </View>
          </View>
        </View>
        
      </View>

      {/* SETTINGS MODAL */}
      <Modal visible={showSettings} animationType="slide" transparent={true} onRequestClose={() => setShowSettings(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: bgApp, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, minHeight: '50%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: textTitle, letterSpacing: -0.5 }}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} color={textTitle} />
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: bgCard, borderRadius: 24, borderWidth: 1, borderColor: borderCard, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: borderCard }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    {isDark ? <Moon size={20} color="#3B82F6" /> : <Sun size={20} color="#3B82F6" />}
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: textTitle }}>Dark Mode</Text>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: textMuted, marginTop: 2 }}>Toggle app theme</Text>
                  </View>
                </View>
                <Switch 
                  value={isDark} 
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#E2E8F0', true: 'rgba(255, 107, 53, 0.5)' }}
                  thumbColor={isDark ? '#FF6B35' : '#ffffff'}
                />
              </View>

              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <Monitor size={20} color={textMuted} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: textTitle }}>Account</Text>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: textMuted, marginTop: 2 }}>Manage profile</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}
