// MyPage.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const MyPage = ({ route }) => {
  const navigation = useNavigation();
  const { onLogout } = route.params || {};

  const { alertConfig, showAlert, hideAlert } = useCustomAlert();

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
          onPress: () => {
            hideAlert();
            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>마이페이지</Text>
        <Text style={styles.subtitle}>프로필과 설정을 관리하세요</Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* 커스텀 Alert 추가 */}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default MyPage;
