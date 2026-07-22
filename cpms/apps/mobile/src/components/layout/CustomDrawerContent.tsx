import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useAuthStore } from '../../core/authStore';
import { useColorScheme } from 'nativewind';
import { 
  LayoutDashboard, Building2, Package, ShoppingCart, FolderKanban, 
  BarChart3, ChevronDown, ChevronRight, HardHat, ClipboardList, 
  FileText, Truck, Users, Settings, LogOut, Hexagon, Mail, Phone, 
  IndianRupee, CheckCircle2, Calendar 
} from 'lucide-react-native';

type NavItem = {
  label: string;
  href?: string;
  icon: (props: any) => React.ReactNode;
  children?: { label: string; href: string; icon: (props: any) => React.ReactNode }[];
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/(app)/(tabs)", icon: (props) => <LayoutDashboard {...props} /> },
  { label: "Vendors", href: "/(app)/(tabs)/vendors", icon: (props) => <Building2 {...props} /> },
  { label: "Materials", href: "/(app)/(tabs)/materials", icon: (props) => <Package {...props} /> },
  {
    label: "Procurement",
    icon: (props) => <ShoppingCart {...props} />,
    children: [
      { label: "Material Indents", href: "/(app)/(tabs)/indents", icon: (props) => <ClipboardList {...props} /> },
      { label: "Purchase Orders", href: "/procurement/orders", icon: (props) => <FileText {...props} /> },
      { label: "Goods Receipts", href: "/procurement/grn", icon: (props) => <Truck {...props} /> },
    ],
  },
  {
    label: "Projects & Sites",
    icon: (props) => <FolderKanban {...props} />,
    children: [
      { label: "All Projects", href: "/(app)/(tabs)/projects", icon: (props) => <FolderKanban {...props} /> },
      { label: "Labour Logs", href: "/projects/labour", icon: (props) => <Users {...props} /> },
    ],
  },
  { label: "Reports", href: "/reports", icon: (props) => <BarChart3 {...props} /> },
];

const EMPLOYEE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/(app)/(tabs)", icon: (props) => <LayoutDashboard {...props} /> },
  { label: "My Attendance", href: "/(app)/(tabs)/attendance", icon: (props) => <ClipboardList {...props} /> },
  { label: "My Daily Wages", href: "/employee/wages", icon: (props) => <IndianRupee {...props} /> },
  { label: "My Assigned Project", href: "/employee/my-project", icon: (props) => <Building2 {...props} /> },
  { label: "Today's Tasks", href: "/employee/tasks", icon: (props) => <CheckCircle2 {...props} /> },
  { label: "Announcements", href: "/employee/announcements", icon: (props) => <Mail {...props} /> },
  { label: "Leave Requests", href: "/employee/leave", icon: (props) => <Calendar {...props} /> },
  { label: "Profile", href: "/employee/profile", icon: (props) => <Users {...props} /> },
];

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const userRole = user?.role || "MANAGER";
  const isEmployee = userRole === "EMPLOYEE";
  const currentNav = isEmployee ? EMPLOYEE_NAV : NAV;

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Procurement: true,
    "Projects & Sites": true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const isActive = (href: string) => {
    if (href === "/(app)/(tabs)") return pathname === "/" || pathname === "/(app)/(tabs)";
    return pathname.startsWith(href.replace("/(app)/(tabs)", ""));
  };

  const bgApp = isDark ? '#05070A' : '#F8FAFC';
  const textTitle = isDark ? '#F8FAFC' : '#0F172A';
  const textSecondary = isDark ? '#E2E8F0' : '#334155';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderCard = isDark ? 'rgba(30, 41, 59, 0.8)' : '#E2E8F0';
  const bgHover = isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9';
  const bgActive = isDark ? 'rgba(255, 107, 53, 0.1)' : '#FFF7ED';
  const brandPrimary = '#FF6B35';

  return (
    <View style={{ flex: 1, backgroundColor: bgApp }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingVertical: 0 }}>
        
        {/* Header */}
        <View style={{ padding: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: borderCard }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: brandPrimary, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
            <Hexagon size={24} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>CPMS Enterprise</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: brandPrimary, textTransform: 'uppercase', marginTop: 2 }}>{userRole} Workspace</Text>
          </View>
        </View>

        {/* Navigation */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 8 }}>Main Menu</Text>
          
          {currentNav.map((item) => {
            if (item.href) {
              const active = isActive(item.href);
              return (
                <TouchableOpacity 
                  key={item.label}
                  onPress={() => router.push(item.href as any)}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: active ? bgActive : 'transparent', marginBottom: 4 }}
                >
                  <View style={{ width: 24, alignItems: 'center', marginRight: 16 }}>
                    {item.icon({ size: 22, color: active ? brandPrimary : textSecondary })}
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: active ? '700' : '600', color: active ? brandPrimary : textSecondary }}>{item.label}</Text>
                </TouchableOpacity>
              );
            }

            const isOpen = openGroups[item.label] ?? false;
            
            return (
              <View key={item.label} style={{ marginBottom: 4 }}>
                <TouchableOpacity 
                  onPress={() => toggleGroup(item.label)}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: 'transparent' }}
                >
                  <View style={{ width: 24, alignItems: 'center', marginRight: 16 }}>
                    {item.icon({ size: 22, color: textSecondary })}
                  </View>
                  <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: textSecondary }}>{item.label}</Text>
                  {isOpen ? <ChevronDown size={18} color={textMuted} /> : <ChevronRight size={18} color={textMuted} />}
                </TouchableOpacity>

                {isOpen && (
                  <View style={{ paddingLeft: 40, marginTop: 4 }}>
                    {item.children?.map((child) => {
                      const active = isActive(child.href);
                      return (
                        <TouchableOpacity 
                          key={child.label}
                          onPress={() => router.push(child.href as any)}
                          style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: active ? bgActive : 'transparent', marginBottom: 2 }}
                        >
                          <View style={{ width: 20, alignItems: 'center', marginRight: 12 }}>
                            {child.icon({ size: 18, color: active ? brandPrimary : textMuted })}
                          </View>
                          <Text style={{ fontSize: 14, fontWeight: active ? '700' : '500', color: active ? brandPrimary : textMuted }}>{child.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

      </DrawerContentScrollView>

      {/* Footer */}
      <View style={{ padding: 20, borderTopWidth: 1, borderColor: borderCard }}>
        {!isEmployee && (
          <TouchableOpacity onPress={() => router.push('/settings' as any)} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 4 }}>
            <View style={{ width: 24, alignItems: 'center', marginRight: 16 }}><Settings size={22} color={textSecondary} /></View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: textSecondary }}>Settings</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleLogout} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12 }}>
          <View style={{ width: 24, alignItems: 'center', marginRight: 16 }}><LogOut size={22} color="#EF4444" /></View>
          <Text style={{ fontSize: 15, fontWeight: '600', color: "#EF4444" }}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 16, backgroundColor: bgHover, borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>CPMS Support</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Mail size={14} color={textMuted} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: textSecondary }}>support@cpms.com</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Phone size={14} color={textMuted} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: textSecondary }}>+1 (800) 555-0199</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
