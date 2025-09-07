// components/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Home from '../pages/HomeScreen';
import Write from '../pages/Write';
import MyPage from '../pages/MyPage';
import DiaryEditor from '../pages/DiaryEditor';
import EmotionSelector from '../pages/EmotionSelector';
import DiaryDetail from '../pages/DiaryDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'WriteList';

  // EmotionSelector 화면에서는 탭바 숨김
  if (routeName === 'EmotionSelector' || routeName === 'DiaryEditor' || routeName === 'DiaryDetail') {
    return { display: 'none' };
  }

  // 기본 탭바 스타일 반환
  return {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    height: 85,
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
  };
};

// Write 관련 스택 네비게이터 생성
const WriteStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' }
      }}
    >
      <Stack.Screen
        name="WriteList"
        component={Write}
        options={{ title: '일기 목록' }}
      />
      <Stack.Screen
        name="DiaryEditor"
        component={DiaryEditor}
        options={{ title: '일기 작성' }}
      />
      <Stack.Screen
        name="EmotionSelector"
        component={EmotionSelector}
        options={{ title: '감정 선택' }}
      />
      <Stack.Screen
        name="DiaryDetail"
        component={DiaryDetail}
        options={{ title: '일기 보기' }}
      />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'WriteTab') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'MyPage') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#FB644C',
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -8,
          },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 20,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        // 헤더 완전 제거
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '홈',
        }}
      />

      <Tab.Screen
        name="WriteTab"
        component={WriteStack}
        options={({ route }) => ({
          tabBarLabel: '일기쓰기',
          headerShown: false,
          tabBarStyle: getTabBarVisibility(route),
        })}
      />

      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          tabBarLabel: '마이페이지',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
