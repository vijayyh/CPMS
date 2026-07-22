import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform, useWindowDimensions, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore, Storage } from '../core/authStore';
import { fetchApi } from '../core/api';
import { useColorScheme } from 'nativewind';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setSessionToken = useAuthStore(state => state.setSessionToken);
  const setUser = useAuthStore(state => state.setUser);
  
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900; 

  // Exact CSS variables from web
  const bgApp = isDark ? '#0B0F19' : '#FDFDFE';
  const bgBorder = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(17, 24, 39, 0.06)';
  const bgBorderStrong = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 24, 39, 0.08)';
  const bgCard = isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.85)';
  const bgCardSolid = isDark ? '#0F172A' : '#FFFFFF';
  const textTitle = isDark ? '#F8FAFC' : '#0F172A';
  const textPrimary = isDark ? '#E2E8F0' : '#334155';
  const textMuted = isDark ? '#64748B' : '#94A3B8';
  const brandAmber = '#F59E0B';

  const gridStyle = Platform.OS === 'web' ? {
    backgroundImage: `linear-gradient(rgba(208, 83, 43, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(208, 83, 43, 0.05) 1px, transparent 1px)`,
    backgroundSize: '40px 40px'
  } : {};

  // Sync web HTML class so global.css body background updates correctly
  useEffect(() => {
    if (Platform.OS === 'web') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    toggleColorScheme();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setLoading(true);

    // CRITICAL: Clear any existing session before attempting to login!
    // Otherwise fetchApi might inject the old user's token into the request.
    const logout = useAuthStore.getState().logout;
    await logout();

    try {
      // 1. Fetch CSRF Token to satisfy NextAuth v5 requirements
      const csrfResponse = await fetchApi('/api/auth/csrf');
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData?.csrfToken;
      
      const setCookieHeader = csrfResponse.headers.get('set-cookie');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      // Extract the CSRF cookie to send back
      if (setCookieHeader) {
        const match = setCookieHeader.match(/(?:authjs\.csrf-token|next-auth\.csrf-token)=([^;]+)/);
        if (match) {
          headers['Cookie'] = match[0];
        }
      }

      // 2. Submit credentials
      const response = await fetchApi('/api/auth/callback/credentials', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password, redirect: false, csrfToken }),
      });

      if (!response.ok) {
        Alert.alert('Login Failed', 'Invalid email or password.');
        setLoading(false);
        return;
      }

      const sessionCookieHeader = response.headers.get('set-cookie');
      let token = null;
      if (sessionCookieHeader) {
        const match = sessionCookieHeader.match(/(?:authjs\.session-token|next-auth\.session-token)=([^;]+)/);
        if (match && match[1]) token = match[1];
      }

      const sessionResponse = await fetchApi('/api/auth/session', {
        headers: token ? { 'Cookie': `authjs.session-token=${token}` } : {},
      });
      const sessionData = await sessionResponse.json();

      if (sessionData && sessionData.user) {
        if (token) await setSessionToken(token);
        await Storage.setItemAsync('user_profile', JSON.stringify(sessionData.user));
        setUser(sessionData.user);
      } else {
        Alert.alert('Login Failed', 'Could not retrieve session data.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgApp }}>
      {/* Animated Background Grid */}
      <View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }, gridStyle as any]} />

      {/* Theme Toggle Button */}
      <TouchableOpacity 
        onPress={handleToggleTheme}
        style={{ position: 'absolute', top: 24, right: 24, zIndex: 100, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        
        {/* Left Panel - Hidden on Mobile */}
        {isLargeScreen && (
          <View style={{ flex: 1, padding: 56, borderRightWidth: 1, borderColor: bgBorder, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 44, height: 44, backgroundColor: brandAmber, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>🏢</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: textTitle, letterSpacing: -0.5 }}>CPMS</Text>
            </View>

            <View style={{ maxWidth: 500, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: brandAmber }} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: brandAmber, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Construction Management Platform
                </Text>
              </View>
              <Text style={{ fontSize: 48, fontWeight: '800', color: textTitle, lineHeight: 48, letterSpacing: -1.5 }}>
                Command Center for
              </Text>
              <Text style={{ fontSize: 48, fontWeight: '800', color: brandAmber, lineHeight: 48, letterSpacing: -1.5, marginBottom: 20 }}>
                Sustaniq Civilcon.
              </Text>
              <Text style={{ fontSize: 14, color: textMuted, lineHeight: 22, maxWidth: 420 }}>
                Internal construction ERP for Sustaniq Civilcon LLP. Streamlining procurement, site execution, quality control, and subcontractor billing across 10+ active sites in Mumbai.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 32, paddingVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: bgBorder }}>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: brandAmber }}>1250+</Text>
                <Text style={{ fontSize: 11, color: textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 }}>Active Vendors</Text>
              </View>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: brandAmber }}>15000+</Text>
                <Text style={{ fontSize: 11, color: textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 }}>Materials Tracked</Text>
              </View>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: brandAmber }}>300+</Text>
                <Text style={{ fontSize: 11, color: textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 }}>Live Projects</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {["Vendor Management", "Procurement Engine", "GRN Tracking", "Site Inventory", "Labour Logs", "Reports"].map((m) => (
                <View key={m} style={{ paddingHorizontal: 12, paddingVertical: 5, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', borderWidth: 1, borderColor: bgBorderStrong, borderRadius: 9999 }}>
                  <Text style={{ fontSize: 11, color: textMuted, fontWeight: '500' }}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Right Panel - Form (Centered on all screens) */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={[
            { width: '100%', maxWidth: 420, backgroundColor: bgCard, borderWidth: 1, borderColor: bgBorderStrong, borderRadius: 28, overflow: 'hidden' },
            Platform.OS === 'web' && { backdropFilter: 'blur(32px)' } as any
          ]}>
            <View style={{ padding: 32, paddingBottom: 24, alignItems: 'center', borderBottomWidth: 1, borderColor: bgBorder }}>
              <View style={{ width: 44, height: 44, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>🏢</Text>
              </View>
              <Text style={{ fontSize: 20, color: textTitle, fontWeight: '700', marginBottom: 4 }}>Sign in to CPMS</Text>
              <Text style={{ fontSize: 13, color: textMuted, textAlign: 'center' }}>Enter your credentials to access the management dashboard</Text>
            </View>

            <View style={{ padding: 32, paddingTop: 28 }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: textPrimary, marginBottom: 6 }}>Email Address</Text>
                <TextInput
                  style={{ height: 44, paddingHorizontal: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', borderWidth: 1, borderColor: bgBorderStrong, borderRadius: 10, color: textPrimary, fontSize: 14 }}
                  placeholder="you@company.com"
                  placeholderTextColor={textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: textPrimary, marginBottom: 6 }}>Password</Text>
                <TextInput
                  style={{ height: 44, paddingHorizontal: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', borderWidth: 1, borderColor: bgBorderStrong, borderRadius: 10, color: textPrimary, fontSize: 14 }}
                  placeholder="••••••••"
                  placeholderTextColor={textMuted}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={{ height: 48, backgroundColor: textTitle, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%' }}
              >
                {loading ? (
                  <ActivityIndicator color={bgCardSolid} />
                ) : (
                  <Text style={{ fontWeight: '600', fontSize: 14, color: bgCardSolid }}>Sign In to Dashboard</Text>
                )}
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: bgBorder }} />
                <Text style={{ marginHorizontal: 12, fontSize: 13, color: textMuted }}>or continue with</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: bgBorder }} />
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <TouchableOpacity style={{ flex: 1, height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', borderWidth: 1, borderColor: bgBorderStrong, borderRadius: 14 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: textPrimary }}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', borderWidth: 1, borderColor: bgBorderStrong, borderRadius: 14 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: textPrimary }}>Phone</Text>
                </TouchableOpacity>
              </View>
              
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 14, color: textMuted }}>
                  Don't have an account? <Text style={{ color: brandAmber, fontWeight: '600' }}>Sign Up</Text>
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={{ marginTop: 24, fontSize: 12, color: textMuted, textAlign: 'center' }}>
            CPMS · Construction Procurement & Management System
          </Text>
        </View>

      </View>
    </View>
  );
}
