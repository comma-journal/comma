// DiaryEditor.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { diaryEditorStyles } from '../styles/DiaryEditorStyles';

const DiaryEditor = ({ navigation, route }) => {
    const editingDiary = route?.params?.diary;
    const isEditing = !!editingDiary;

    const [title, setTitle] = useState(editingDiary?.title || '');
    const [content, setContent] = useState(editingDiary?.content || '');
    
    const titleInputRef = useRef(null);
    const contentInputRef = useRef(null);

    useEffect(() => {
        // 새 일기 작성 시 제목에 포커스
        if (!isEditing && titleInputRef.current) {
            setTimeout(() => {
                titleInputRef.current.focus();
            }, 100);
        }
    }, [isEditing]);

    // 오늘 날짜 가져오기
    const getTodayDate = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[today.getDay()];
        return `${month}월 ${day}일 ${weekday}`;
    };

    // 뒤로가기 처리
    const handleBackPress = () => {
        if (title.trim() || content.trim()) {
            Alert.alert(
                '작성 취소',
                '작성 중인 내용이 있습니다. 정말 나가시겠습니까?',
                [
                    { text: '계속 작성', style: 'cancel' },
                    { text: '나가기', onPress: () => navigation.goBack() }
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    // 다음 단계로 이동 (감정 추가)
    const handleNext = () => {
        if (!content.trim()) {
            Alert.alert('알림', '일기 내용을 입력해주세요.');
            return;
        }

        const diaryData = {
            id: isEditing ? editingDiary.id : Date.now().toString(),
            title: title.trim() || '제목 없음',
            content: content.trim(),
            createdAt: isEditing ? editingDiary.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emotionSegments: isEditing ? editingDiary.emotionSegments || [] : [],
        };

        navigation.navigate('EmotionSelector', { 
            diary: diaryData,
            isEditing: isEditing 
        });
    };

    return (
        <SafeAreaView style={diaryEditorStyles.container}>
            <KeyboardAvoidingView
                style={diaryEditorStyles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* 헤더 */}
                <View style={diaryEditorStyles.header}>
                    <TouchableOpacity 
                        style={diaryEditorStyles.backButton} 
                        onPress={handleBackPress}
                    >
                        <Icon name="arrow-back" size={24} color="#333333" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={diaryEditorStyles.nextButton} 
                        onPress={handleNext}
                    >
                        <Icon name="arrow-forward" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* 날짜 표시 */}
                <View style={diaryEditorStyles.dateContainer}>
                    <Text style={diaryEditorStyles.dateText}>
                        {isEditing ? '일기 수정' : getTodayDate()}
                    </Text>
                </View>

                {/* 제목 입력 */}
                <View style={diaryEditorStyles.titleContainer}>
                    <TextInput
                        ref={titleInputRef}
                        style={diaryEditorStyles.titleInput}
                        placeholder="오늘의 일기 제목을 입력하세요"
                        placeholderTextColor="#999999"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={50}
                        selectionColor="#E57373"
                    />
                </View>

                {/* 내용 입력 */}
                <View style={diaryEditorStyles.contentContainer}>
                    <ScrollView 
                        style={diaryEditorStyles.scrollView} 
                        contentContainerStyle={diaryEditorStyles.scrollContent}
                    >
                        <TextInput
                            ref={contentInputRef}
                            style={diaryEditorStyles.contentInput}
                            multiline
                            placeholder="오늘 있었던 일들을 자유롭게 써보세요..."
                            placeholderTextColor="#999999"
                            value={content}
                            onChangeText={setContent}
                            textAlignVertical="top"
                            selectionColor="#E57373"
                            scrollEnabled={false}
                        />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default DiaryEditor;
