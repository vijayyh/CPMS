import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, LogBox, Modal, Switch } from 'react-native';
import { useColorScheme } from 'nativewind';

LogBox.ignoreLogs(['Unknown event handler property `onPressIn`', 'Unknown event handler property `onPressOut`']);
import { useAuthStore } from '../../../core/authStore';
import { format } from 'date-fns';
import { 
  Building2, Package, FolderKanban, ShoppingCart, 
  TrendingUp, ClipboardList, AlertCircle, Users, 
  CheckCircle2, Sun, Moon, LogOut, Activity, Bell, Settings, Plus, X, Monitor, ChevronRight, Menu
} from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const PLACEHOLDER_ACTIVITIES = [
  { id: 1, type: "PO", title: "PO-2024-001 created", time: "10m ago", status: "Approved", icon: <ShoppingCart size={18} color="#3B82F6" />, color: "#3B82F6" },
  { id: 2, type: "Indent", title: "IND-882 submitted", time: "1h ago", status: "Review", icon: <ClipboardList size={18} color="#F59E0B" />, color: "#F59E0B" },
  { id: 3, type: "Issue", title: "Concrete delay", time: "2h ago", status: "Open", icon: <AlertCircle size={18} color="#EF4444" />, color: "#EF4444" },
  { id: 4, type: "Task", title: "Site Log Filed", time: "3h ago", status: "Done", icon: <CheckCircle2 size={18} color="#10B981" />, color: "#10B981" },
];

export default function ManagerDashboard() {
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

  const handleAddNew = () => {
    if (Platform.OS === 'web') alert('Quick Add coming soon');
  };

  const toggleTheme = () => {
    toggleColorScheme();
  };

  const userName = user?.name || "User";
  const userRole = user?.role || "MANAGER";
  
  const isAdmin = userRole === "ADMIN" || userRole === "MANAGER";
  const isSiteEngineer = userRole === "SITE_ENGINEER";
  const isAccounts = userRole === "ACCOUNTS";
  const isProcurement = userRole === "PROCUREMENT";
  const isVendor = userRole === "VENDOR";

  const canSeeEngineering = isAdmin || isSiteEngineer;
  const canSeeFinance = isAdmin || isAccounts;
  const canSeeProcurement = isAdmin || isProcurement;

  const bgApp = isDark ? '#05070A' : '#F8FAFC';
  const bgCard = isDark ? 'rgba(15, 23, 42, 0.6)' : '#FFFFFF';
  const borderCard = isDark ? 'rgba(30, 41, 59, 0.8)' : '#E2E8F0';
  const textTitle = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#0F172A' : '#ffffff',
    backgroundGradientTo: isDark ? '#0F172A' : '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 107, 53, ${opacity})` : `rgba(255, 107, 53, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    labelColor: () => textMuted,
    propsForDots: { r: "5", strokeWidth: "3", stroke: isDark ? "#0F172A" : "#fff" },
    decimalPlaces: 0,
  };

  const spendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [40, 30, 50, 20, 60, 45], color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, strokeWidth: 4 }]
  };

  const vendorData = {
    labels: ["UltraTech", "Tata Steel", "L&T Const.", "Asian Paints"],
    datasets: [{ data: [12, 25, 8, 4.5] }]
  };

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
          <Text style={{ fontSize: 32, fontWeight: '900', color: '#FF6B35', lineHeight: 38, letterSpacing: -1 }}>
            {userName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {userRole !== 'EMPLOYEE' && (
            <TouchableOpacity 
              onPress={handleAddNew}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={20} color="#3B82F6" />
            </TouchableOpacity>
          )}
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
          <FolderKanban size={16} color="#3B82F6" />
          <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '700', color: textTitle }}>4 Active Sites</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E293B' : '#F1F5F9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999 }}>
          <Sun size={16} color="#F59E0B" />
          <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '700', color: textTitle }}>28°C Clear</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999 }}>
          <CheckCircle2 size={16} color="#10B981" />
          <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '700', color: '#10B981' }}>On Track</Text>
        </View>
      </View>

      {/* QUICK ACTIONS GRID */}
      <Text style={{ fontSize: 18, fontWeight: '800', color: textTitle, marginBottom: 16, letterSpacing: -0.5 }}>Quick Actions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 }}>
        
        {(canSeeEngineering || canSeeProcurement) && (
          <TouchableOpacity style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 12, elevation: 2 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <ClipboardList size={28} color="#3B82F6" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle }}>New Indent</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: textMuted, marginTop: 4 }}>Material Req.</Text>
          </TouchableOpacity>
        )}

        {canSeeFinance && (
          <TouchableOpacity style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 12, elevation: 2 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? 'rgba(255, 107, 53, 0.15)' : '#FFF7ED', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <ShoppingCart size={28} color="#FF6B35" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle }}>New PO</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: textMuted, marginTop: 4 }}>Purchase Order</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 12, elevation: 2 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <AlertCircle size={28} color="#EF4444" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle }}>Log Issue</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: textMuted, marginTop: 4 }}>Report Problem</Text>
        </TouchableOpacity>

        {canSeeEngineering && (
          <TouchableOpacity style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 12, elevation: 2 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Users size={28} color="#10B981" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle }}>Labour</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: textMuted, marginTop: 4 }}>Daily Log</Text>
          </TouchableOpacity>
        )}

      </View>

      {/* FULL WIDTH KPI CARDS */}
      <View style={{ flexDirection: 'column', gap: 20 }}>
        
        {/* Total Spend */}
        {canSeeFinance && (
          <View style={{ backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <TrendingUp size={18} color="#10B981" />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Spend (YTD)</Text>
              </View>
              <View style={{ backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9999 }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#10B981' }}>+12.4%</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: textMuted, marginRight: 4 }}>₹</Text>
              <Text style={{ fontSize: 48, fontWeight: '900', color: textTitle, letterSpacing: -1.5 }}>24.5L</Text>
            </View>
          </View>
        )}

        {/* Small KPIs Side-by-Side (Still valid if designed well, but let's make them stack vertically or carefully use 48%) */}
        {(canSeeEngineering || canSeeProcurement) && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                <Building2 size={24} color="white" />
              </View>
              <Text style={{ fontSize: 36, fontWeight: '900', color: textTitle, marginBottom: 4 }}>18</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: textMuted }}>Active Vendors</Text>
            </View>
            
            <View style={{ width: '48%', backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                <ClipboardList size={24} color="white" />
              </View>
              <Text style={{ fontSize: 36, fontWeight: '900', color: textTitle, marginBottom: 4 }}>12</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: textMuted }}>Pending Indents</Text>
            </View>
          </View>
        )}

        {/* Spend Chart */}
        {canSeeFinance && (
          <View style={{ backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
            <View style={{ padding: 24, paddingBottom: 16, borderBottomWidth: 1, borderColor: borderCard }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>Spend Analytics</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted, marginTop: 4 }}>Monthly procurement expenditure (Lakhs)</Text>
            </View>
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <LineChart
                data={spendData}
                width={screenWidth - 40} // Full width minus 20px padding on each side of the ScrollView
                height={220}
                chartConfig={chartConfig}
                bezier
                withDots={true}
                withInnerLines={false}
                withOuterLines={false}
                style={{ paddingRight: 30 }}
              />
            </View>
          </View>
        )}

        {/* Top Vendors Chart */}
        {canSeeFinance && (
          <View style={{ backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4 }}>
            <View style={{ padding: 24, paddingBottom: 16, borderBottomWidth: 1, borderColor: borderCard }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>Top Vendors</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted, marginTop: 4 }}>By PO Value (in Lakhs)</Text>
            </View>
            <View style={{ paddingVertical: 24, paddingLeft: 10, alignItems: 'center' }}>
              <BarChart
                data={vendorData}
                width={screenWidth - 40}
                height={240}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                }}
                verticalLabelRotation={30}
                withInnerLines={false}
                showValuesOnTopOfBars
              />
            </View>
          </View>
        )}

        {/* Recent Activity */}
        <View style={{ backgroundColor: bgCard, borderWidth: 1, borderColor: borderCard, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: isDark ? 0.3 : 0.04, shadowRadius: 16, elevation: 4, marginBottom: 20 }}>
          <View style={{ padding: 24, borderBottomWidth: 1, borderColor: borderCard, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>Recent Activity</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted, marginTop: 4 }}>Latest platform updates</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: textTitle }}>View All</Text>
            </TouchableOpacity>
          </View>
          <View>
            {PLACEHOLDER_ACTIVITIES.map((act, i) => (
              <TouchableOpacity key={act.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: i !== PLACEHOLDER_ACTIVITIES.length - 1 ? 1 : 0, borderColor: borderCard }}>
                <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: `${act.color}15`, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  {act.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: textTitle, marginBottom: 4 }}>{act.title}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: textMuted }}>{act.time}</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0', backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#F8FAFC' }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: textTitle }}>{act.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
