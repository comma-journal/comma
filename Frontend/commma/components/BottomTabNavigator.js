import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 페이지들 import
import Home from '../pages/Home';
import Write from '../pages/Write';
import MyPage from '../pages/MyPage';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Write') {
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
        name="Write" 
        component={Write}
        options={{
          title: '일기쓰기',
          tabBarLabel: '일기쓰기',
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