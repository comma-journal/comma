// components/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 페이지들 import
import Home from '../pages/Home';
import Write from '../pages/Write';
import MyPage from '../pages/MyPage';
import DiaryEditor from '../pages/DiaryEditor';
import EmotionSelector from '../pages/EmotionSelector';
import DiaryDetail from '../pages/DiaryDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Write 관련 스택 네비게이터 생성 (수정)
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

// 나머지 코드는 동일...
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'WriteTab') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'MyPage') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={26} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0.5,
          borderTopColor: '#E5E5E7',
          height: 90,
          paddingBottom: 25,
          paddingTop: 15,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: '#007AFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          title: '홈',
          tabBarLabel: '홈',
        }}
      />
      
      <Tab.Screen 
        name="WriteTab" 
        component={WriteStack}
        options={{
          title: '일기쓰기',
          tabBarLabel: '일기쓰기',
          headerShown: false,
        }}
      />
      
      <Tab.Screen 
        name="MyPage" 
        component={MyPage}
        options={{
          title: '마이페이지',
          tabBarLabel: '마이페이지',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
