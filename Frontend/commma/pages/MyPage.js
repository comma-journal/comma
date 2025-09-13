import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const MyPage = ({ route }) => {
  const navigation = useNavigation();
  const { onLogout } = route.params || {};

  const { alertConfig, showAlert, hideAlert } = useCustomAlert();

  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [diaryStats, setDiaryStats] = useState({
    thisWeek: 0,
    thisMonth: 0,
    total: 0
  });
  const [refreshing, setRefreshing] = useState(false);

  // 사용자 정보 로드
  const loadUserInfo = async () => {
    try {
      const savedLoginData = await AsyncStorage.getItem('autoLoginData');
      if (savedLoginData) {
        const loginData = JSON.parse(savedLoginData);
        setUserInfo({
          name: loginData.name || '사용자',
          email: loginData.email || ''
        });
      }
    } catch (error) {
      // console.error('사용자 정보 로드 실패:', error);
    }
  };

  // 일기 통계 계산
  const calculateDiaryStats = async () => {
    try {
      const API_BASE_URL = 'https://comma.gamja.cloud';

      const savedLoginData = await AsyncStorage.getItem('autoLoginData');
      if (!savedLoginData) return;

      const loginData = JSON.parse(savedLoginData);
      const token = loginData.token;

      if (!token) return;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      // 이번 달 데이터 가져오기
      const monthResponse = await fetch(
        `${API_BASE_URL}/v1/me/diary?yearMonth=${currentYear}-${String(currentMonth).padStart(2, '0')}`,
        { method: 'GET', headers }
      );

      if (monthResponse.ok) {
        const monthDiaries = await monthResponse.json();

        if (Array.isArray(monthDiaries)) {
          const thisMonthCount = monthDiaries.length;

          // 이번 주 일기 수 계산
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          const thisWeekCount = monthDiaries.filter(diary => {
            const diaryDate = new Date(diary.entryDate);
            return diaryDate >= startOfWeek && diaryDate <= endOfWeek;
          }).length;

          setDiaryStats({
            thisWeek: thisWeekCount,
            thisMonth: thisMonthCount,
            total: thisMonthCount
          });
        }
      }
    } catch (error) {
      // console.error('일기 통계 로드 실패:', error);
    }
  };

  // 새로고침 핸들러
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUserInfo(), calculateDiaryStats()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadUserInfo();
    calculateDiaryStats();
  }, []);

  const handleLogout = () => {
    showAlert({
      title: '로그아웃',
      message: '정말 로그아웃하시겠습니까?',
      type: 'warning',
      buttons: [
        {
          text: '취소',
          style: 'cancel',
          onPress: hideAlert,
        },
        {
          text: '로그아웃',
          onPress: async () => {
            hideAlert();

            try {
              await AsyncStorage.removeItem('autoLoginData');
            } catch (error) {
              // console.error('로그아웃 처리 실패:', error);
            }

            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    });
  };

  const StatCard = ({ title, count, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statCount}>{count}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* 프로필 섹션 */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Icon name="account-circle" size={60} color="#FB644C" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{userInfo.name}</Text>
                <Text style={styles.userEmail}>{userInfo.email}</Text>
              </View>
            </View>
          </View>

          {/* 일기 통계 섹션 */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>내 일기 현황</Text>

            <StatCard
              title="이번 주 작성한 일기"
              count={diaryStats.thisWeek}
              icon="event-note"
              color="#4CAF50"
            />

            <StatCard
              title="이번 달 작성한 일기"
              count={diaryStats.thisMonth}
              icon="calendar-today"
              color="#2196F3"
            />

            <StatCard
              title="전체 일기"
              count={diaryStats.total}
              icon="library-books"
              color="#FF9800"
            />
          </View>

          {/* 로그아웃 버튼 */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
        onBackdropPress={hideAlert}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    marginRight: 16,
  },
  statInfo: {
    flex: 1,
  },
  statCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#FB644C',
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FB644C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MyPage;