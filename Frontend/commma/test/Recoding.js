// Recoding.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
    Modal,
    Animated,
    Dimensions,
    Easing,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// 감정 데이터
const emotions = [
    { id: '1', name: '열정', color: '#FF2D2D', gradient: ['#FF2D2D', '#FF4444'] },
    { id: '2', name: '흥분', color: '#FF4444', gradient: ['#FF4444', '#FF5C33'] },
    { id: '3', name: '활기', color: '#FF6633', gradient: ['#FF6633', '#FF7F2A'] },
    { id: '4', name: '기쁨', color: '#FF8C1A', gradient: ['#FF8C1A', '#FF9900'] },
    { id: '5', name: '환희', color: '#FFB300', gradient: ['#FFB300', '#FFCC00'] },
    { id: '6', name: '분노', color: '#E62E2E', gradient: ['#E62E2E', '#FF4D4D'] },
    { id: '7', name: '격분', color: '#FF4D4D', gradient: ['#FF4D4D', '#FF6640'] },
    { id: '8', name: '화남', color: '#FF7A40', gradient: ['#FF7A40', '#FF9933'] },
    { id: '9', name: '짜증', color: '#FFB333', gradient: ['#FFB333', '#FFCC33'] },
    { id: '10', name: '희망', color: '#FFDD33', gradient: ['#FFDD33', '#FFEE00'] },
    { id: '11', name: '경멸', color: '#CC3333', gradient: ['#CC3333', '#E64D4D'] },
    { id: '12', name: '혐오', color: '#E64D4D', gradient: ['#E64D4D', '#FF6B47'] },
    { id: '13', name: '불만', color: '#FF8547', gradient: ['#FF8547', '#FFAA47'] },
    { id: '14', name: '피로', color: '#FFCC47', gradient: ['#FFCC47', '#FFEE47'] },
    { id: '15', name: '만족', color: '#EEFF47', gradient: ['#EEFF47', '#CCFF47'] },
    { id: '16', name: '실망', color: '#B33333', gradient: ['#B33333', '#CC5555'] },
    { id: '17', name: '우울', color: '#CC6655', gradient: ['#CC6655', '#E68855'] },
    { id: '18', name: '무력감', color: '#FFAA55', gradient: ['#FFAA55', '#FFCC77'] },
    { id: '19', name: '안정', color: '#CCDD77', gradient: ['#CCDD77', '#AAEE77'] },
    { id: '20', name: '성장', color: '#88FF77', gradient: ['#88FF77', '#66FF88'] },
    { id: '21', name: '슬픔', color: '#994444', gradient: ['#994444', '#BB6666'] },
    { id: '22', name: '침울', color: '#BB7766', gradient: ['#BB7766', '#CC9977'] },
    { id: '23', name: '지루함', color: '#DDBB77', gradient: ['#DDBB77', '#DDCC99'] },
    { id: '24', name: '평화', color: '#BBDD99', gradient: ['#BBDD99', '#99DD99'] },
    { id: '25', name: '조화', color: '#77DD99', gradient: ['#77DD99', '#55DDAA'] },
    { id: '26', name: '절망', color: '#775555', gradient: ['#775555', '#996666'] },
    { id: '27', name: '공허', color: '#997788', gradient: ['#997788', '#AA8899'] },
    { id: '28', name: '무관심', color: '#BB9999', gradient: ['#BB9999', '#CCAAAA'] },
    { id: '29', name: '신뢰', color: '#AACCAA', gradient: ['#AACCAA', '#88CCAA'] },
    { id: '30', name: '균형', color: '#66CCBB', gradient: ['#66CCBB', '#44CCCC'] },
    { id: '31', name: '외로움', color: '#556677', gradient: ['#556677', '#667788'] },
    { id: '32', name: '고독', color: '#6688AA', gradient: ['#6688AA', '#7799BB'] },
    { id: '33', name: '냉정', color: '#88AABB', gradient: ['#88AABB', '#99BBCC'] },
    { id: '34', name: '평온', color: '#99CCDD', gradient: ['#99CCDD', '#77AADD'] },
    { id: '35', name: '고요', color: '#5588CC', gradient: ['#5588CC', '#3366BB'] },
    { id: '36', name: '불안', color: '#445577', gradient: ['#445577', '#556688'] },
    { id: '37', name: '의심', color: '#556699', gradient: ['#556699', '#6677AA'] },
    { id: '38', name: '집중', color: '#6688BB', gradient: ['#6688BB', '#7799CC'] },
    { id: '39', name: '사색', color: '#7799DD', gradient: ['#7799DD', '#6688CC'] },
    { id: '40', name: '깊이', color: '#5577BB', gradient: ['#5577BB', '#4466AA'] },
    { id: '41', name: '두려움', color: '#334466', gradient: ['#334466', '#445577'] },
    { id: '42', name: '공포', color: '#445588', gradient: ['#445588', '#556699'] },
    { id: '43', name: '경악', color: '#5566AA', gradient: ['#5566AA', '#6677BB'] },
    { id: '44', name: '신비', color: '#6677CC', gradient: ['#6677CC', '#7766BB'] },
    { id: '45', name: '영감', color: '#7755AA', gradient: ['#7755AA', '#884499'] },
    { id: '46', name: '혼란', color: '#443355', gradient: ['#443355', '#554466'] },
    { id: '47', name: '당황', color: '#554477', gradient: ['#554477', '#665588'] },
    { id: '48', name: '충격', color: '#665599', gradient: ['#665599', '#7766AA'] },
    { id: '49', name: '사랑', color: '#8866AA', gradient: ['#8866AA', '#AA5588'] },
    { id: '50', name: '애정', color: '#CC4466', gradient: ['#CC4466', '#DD3355'] },
];

const Recoding = () => {
    // 기본 상태들
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isEmotionMode, setIsEmotionMode] = useState(false);
    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);
    const [emotionSegments, setEmotionSegments] = useState([]);

    // 감정 선택 관련
    const [emotionModalVisible, setEmotionModalVisible] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [selectedTextRange, setSelectedTextRange] = useState({ start: 0, end: 0 });
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [isEditingEmotion, setIsEditingEmotion] = useState(false);
    const [editingSegmentId, setEditingSegmentId] = useState(null);

    // 하단 선택 바 애니메이션
    const bottomBarAnimation = useRef(new Animated.Value(0)).current;
    const [showBottomSelectionBar, setShowBottomSelectionBar] = useState(false);

    // 감정 선택 애니메이션
    const cardAnimations = useRef(
        emotions.map(() => ({
            scale: new Animated.Value(1),
            translateY: new Animated.Value(0),
        }))
    ).current;

    const textInputRef = useRef(null);
    const titleInputRef = useRef(null);
    const emotionScrollRef = useRef(null);

    // 오늘 날짜 가져오기
    const getTodayDate = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[today.getDay()];
        return `${month}월 ${day}일 ${weekday}`;
    };

    // 뒤로가기 핸들러
    const handleBackPress = () => {
        console.log('뒤로가기 버튼 클릭됨');
    };

    // 저장 핸들러
    const handleSavePress = () => {
        console.log('일기 제목:', title);
        console.log('일기 저장:', content);
        console.log('감정 세그먼트:', emotionSegments);
    };

    // 제목 변경 핸들러
    const handleTitleChange = (newTitle) => {
        setTitle(newTitle);
    };

    // 글쓰기 모드로 전환
    const enterWriteMode = () => {
        setIsEmotionMode(false);
        hideBottomSelectionBar();
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    // 감정 선택 모드로 전환
    const enterEmotionMode = () => {
        setIsEmotionMode(true);
        if (textInputRef.current) {
            textInputRef.current.blur();
        }
    };

    // 하단 선택 바 표시
    const showBottomSelectionBarFunc = () => {
        setShowBottomSelectionBar(true);
        Animated.timing(bottomBarAnimation, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    };

    // 하단 선택 바 숨김
    const hideBottomSelectionBar = () => {
        Animated.timing(bottomBarAnimation, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            setShowBottomSelectionBar(false);
        });
    };

    // 텍스트 변경 핸들러
    const handleTextChange = (newText) => {
        const oldText = content;
        setContent(newText);

        // 텍스트 변경 시 선택 바 숨김
        if (showBottomSelectionBar) {
            hideBottomSelectionBar();
        }

        if (emotionSegments.length > 0) {
            updateSegmentsAfterTextChange(oldText, newText);
        }
    };

    // 텍스트 변경 후 세그먼트 업데이트
    const updateSegmentsAfterTextChange = (oldText, newText) => {
        const updatedSegments = [];

        emotionSegments.forEach(segment => {
            const segmentText = segment.text;
            const newIndex = newText.indexOf(segmentText);

            if (newIndex !== -1) {
                let bestIndex = newIndex;
                let minDistance = Math.abs(segment.start - newIndex);

                let searchIndex = newIndex;
                while ((searchIndex = newText.indexOf(segmentText, searchIndex + 1)) !== -1) {
                    const distance = Math.abs(segment.start - searchIndex);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestIndex = searchIndex;
                    }
                }

                const updatedSegment = {
                    ...segment,
                    start: bestIndex,
                    end: bestIndex + segmentText.length
                };

                if (updatedSegment.end <= newText.length) {
                    updatedSegments.push(updatedSegment);
                }
            }
        });

        setEmotionSegments(updatedSegments);
    };

    // 선택 변경 핸들러
    const handleSelectionChange = (event) => {
        const { start, end } = event.nativeEvent.selection;
        setSelectionStart(start);
        setSelectionEnd(end);

        if (isEmotionMode && start !== end) {
            const selected = content.slice(start, end);
            setSelectedText(selected);
            setSelectedTextRange({ start, end });
            // 텍스트 선택 시 하단 바 표시
            showBottomSelectionBarFunc();
        } else {
            // 선택 해제 시 하단 바 숨김
            if (showBottomSelectionBar) {
                hideBottomSelectionBar();
            }
        }
    };

    // 문장 드래그 시 감정 선택 모달 열기
    const openEmotionModal = () => {
        if (isEmotionMode && selectionStart !== selectionEnd) {
            const selected = content.slice(selectionStart, selectionEnd);
            setSelectedText(selected);
            setSelectedTextRange({ start: selectionStart, end: selectionEnd });
            setEmotionModalVisible(true);
            setSelectedEmotion(null);
            setIsEditingEmotion(false);
            setEditingSegmentId(null);

            // 하단 바 숨김
            hideBottomSelectionBar();

            // 애니메이션 초기화
            resetEmotionAnimations();
        }
    };

    // 기존 감정 편집
    const editEmotion = (segment) => {
        setSelectedText(segment.text);
        setSelectedTextRange({ start: segment.start, end: segment.end });
        setSelectedEmotion(emotions.find(e => e.id === segment.emotionId));
        setIsEditingEmotion(true);
        setEditingSegmentId(segment.id);
        setEmotionModalVisible(true);

        // 애니메이션 초기화
        resetEmotionAnimations();
    };

    // 감정 삭제 (모달에서 삭제)
    const deleteEmotionFromModal = () => {
        Alert.alert(
            '감정 제거',
            '정말 감정을 제거하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '제거',
                    style: 'destructive',
                    onPress: () => {
                        setEmotionSegments(prev => prev.filter(segment => segment.id !== editingSegmentId));
                        closeEmotionModal();
                    }
                }
            ]
        );
    };

    // 감정 애니메이션 초기화
    const resetEmotionAnimations = () => {
        cardAnimations.forEach(anim => {
            anim.scale.setValue(1);
            anim.translateY.setValue(0);
        });
    };

    // 감정 선택 처리 (다른 감정 흐리게 하는 효과 제거)
    const handleEmotionSelect = (emotion) => {
        if (selectedEmotion && selectedEmotion.id === emotion.id) {
            setSelectedEmotion(null);
            resetEmotionAnimations();
            return;
        }

        // 기존에 선택된 감정이 있으면 해당 카드의 애니메이션 초기화
        if (selectedEmotion) {
            const previousSelectedIndex = emotions.findIndex(e => e.id === selectedEmotion.id);
            if (previousSelectedIndex !== -1) {
                Animated.parallel([
                    Animated.timing(cardAnimations[previousSelectedIndex].scale, {
                        toValue: 1,
                        duration: 200,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(cardAnimations[previousSelectedIndex].translateY, {
                        toValue: 0,
                        duration: 200,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }

        setSelectedEmotion(emotion);

        const selectedIndex = emotions.findIndex(e => e.id === emotion.id);

        // 새로 선택된 감정 카드만 애니메이션
        Animated.parallel([
            Animated.spring(cardAnimations[selectedIndex].scale, {
                toValue: 1.1,
                friction: 6,
                tension: 150,
                useNativeDriver: true,
            }),
            Animated.timing(cardAnimations[selectedIndex].translateY, {
                toValue: -8,
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    };

    // 감정 적용 처리
    const applyEmotion = () => {
        if (!selectedEmotion || !selectedText.trim()) {
            Alert.alert('오류', '감정과 텍스트를 선택해주세요.');
            return;
        }

        // 기존 세그먼트와 겹치는 부분이 있는지 확인
        const overlappingSegments = emotionSegments.filter(segment =>
            segment.start < selectedTextRange.end && segment.end > selectedTextRange.start
        );

        // 겹치는 부분이 있고, 편집 모드가 아닌 경우에만 확인 알림 표시
        if (overlappingSegments.length > 0 && !isEditingEmotion) {
            Alert.alert(
                '기존 감정 삭제',
                '이미 감정이 선택된 부분이 있습니다. 기존의 감정은 삭제됩니다. 진행하시겠습니까?',
                [
                    { text: '취소', style: 'cancel' },
                    {
                        text: '확인',
                        onPress: () => {
                            saveEmotionReplace();
                        }
                    },
                ]
            );
            return;
        } else {
            saveEmotionReplace();
        }
    };

    const saveEmotionReplace = () => {
        const newSegment = {
            id: isEditingEmotion ? editingSegmentId : Date.now().toString(),
            text: selectedText,
            start: selectedTextRange.start,
            end: selectedTextRange.end,
            emotionId: selectedEmotion.id,
            emotionName: selectedEmotion.name,
            emotionColor: selectedEmotion.color,
        };

        if (isEditingEmotion) {
            // 기존 감정 수정
            setEmotionSegments(prev => prev.map(segment =>
                segment.id === editingSegmentId ? newSegment : segment
            ));
        } else {
            // 겹치는 세그먼트 제거 후 새 세그먼트 추가
            const filteredSegments = emotionSegments.filter(segment =>
                !(segment.start < selectedTextRange.end && segment.end > selectedTextRange.start)
            );
            setEmotionSegments([...filteredSegments, newSegment]);
        }

        closeEmotionModal();
    };

    // 감정 모달 닫기
    const closeEmotionModal = () => {
        setEmotionModalVisible(false);
        setSelectedEmotion(null);
        setSelectedText('');
        setSelectedTextRange({ start: 0, end: 0 });
        setIsEditingEmotion(false);
        setEditingSegmentId(null);
        resetEmotionAnimations();
    };

    // 스타일된 텍스트 렌더링 - 태그 없이 배경색만 적용
    const renderStyledText = () => {
        if (emotionSegments.length === 0) {
            return (
                <Text style={styles.styledText}>
                    {content}
                </Text>
            );
        }

        const sortedSegments = [...emotionSegments].sort((a, b) => a.start - b.start);

        // 각 글자별로 감정 정보를 매핑
        const charEmotions = new Array(content.length).fill(null);
        sortedSegments.forEach(segment => {
            for (let i = segment.start; i < segment.end; i++) {
                if (i < content.length) {
                    charEmotions[i] = segment;
                }
            }
        });

        const elements = [];
        let currentIndex = 0;

        while (currentIndex < content.length) {
            const currentEmotion = charEmotions[currentIndex];
            let endIndex = currentIndex;

            // 같은 감정 상태의 연속된 글자들을 그룹화
            while (endIndex < content.length && charEmotions[endIndex] === currentEmotion) {
                endIndex++;
            }

            const textSegment = content.slice(currentIndex, endIndex);
            const isEmotion = currentEmotion !== null;

            if (isEmotion) {
                // 감정이 적용된 텍스트 - 배경색만 적용
                elements.push(
                    <Text
                        key={`emotion-${currentIndex}`}
                        style={[
                            styles.styledText,
                            {
                                backgroundColor: currentEmotion.emotionColor + '40',
                                borderRadius: 2,
                            }
                        ]}
                        onPress={() => editEmotion(currentEmotion)}
                    >
                        {textSegment}
                    </Text>
                );
            } else {
                // 일반 텍스트
                elements.push(
                    <Text key={`normal-${currentIndex}`} style={styles.styledText}>
                        {textSegment}
                    </Text>
                );
            }

            currentIndex = endIndex;
        }

        return (
            <Text style={styles.styledText}>
                {elements}
            </Text>
        );
    };



    // 에디터 렌더링
    const renderEditor = () => {
        if (!isEmotionMode) {
            // 글쓰기 모드
            return (
                <TextInput
                    ref={textInputRef}
                    style={styles.textInput}
                    multiline
                    placeholder="오늘의 일기를 입력해주세요."
                    placeholderTextColor="#999999"
                    value={content}
                    onChangeText={handleTextChange}
                    onSelectionChange={handleSelectionChange}
                    textAlignVertical="top"
                    selectionColor="#E57373"
                    scrollEnabled={false}
                />
            );
        } else {
            // 감정 선택 모드 - 정확한 오버레이 적용
            return (
                <View style={styles.hybridContainer}>
                    <View style={styles.styledOverlay}>
                        {renderStyledText()}
                    </View>
                    <TextInput
                        ref={textInputRef}
                        style={styles.hybridInput}
                        multiline
                        value={content}
                        onChangeText={handleTextChange}
                        onSelectionChange={handleSelectionChange}
                        textAlignVertical="top"
                        selectionColor="#E57373"
                        showSoftInputOnFocus={false}
                        keyboardType="default"
                        scrollEnabled={false}
                    />
                </View>
            );
        }
    };

    // 감정 카드 렌더링
    const renderEmotionCard = (emotion, index) => {
        const cardWidth = width / 5 - 14;
        const cardHeight = 66;

        return (
            <Animated.View
                key={emotion.id}
                style={[
                    styles.emotionCard,
                    {
                        width: cardWidth,
                        height: cardHeight,
                        backgroundColor: emotion.color,
                        transform: [
                            { translateY: cardAnimations[index].translateY },
                            { scale: cardAnimations[index].scale },
                        ],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.emotionCardTouchArea}
                    activeOpacity={0.9}
                    onPress={() => handleEmotionSelect(emotion)}
                >
                    <Text style={[
                        styles.emotionCardText,
                        {
                            fontSize: selectedEmotion?.id === emotion.id ? 14 : 11,
                            fontWeight: selectedEmotion?.id === emotion.id ? '900' : '800',
                        }
                    ]}>
                        {emotion.name}
                    </Text>
                    {selectedEmotion?.id === emotion.id && (
                        <View style={styles.selectedBadge}>
                            <Text style={styles.selectedBadgeText}>✓</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
            >
                {/* 상단 헤더 */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Icon name="arrow-back" size={24} color="#333333" />
                    </TouchableOpacity>

                    <View style={styles.headerButtons}>
                        {/* 글쓰기/감정 선택 토글 버튼 */}
                        {content.length > 0 && (
                            <View style={styles.modeButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.modeButton,
                                        styles.leftModeButton,
                                        !isEmotionMode && styles.modeButtonActive
                                    ]}
                                    onPress={enterWriteMode}
                                >
                                    <Icon name="edit" size={16} color={!isEmotionMode ? "#FFFFFF" : "#E57373"} />
                                    <Text style={[
                                        styles.modeButtonText,
                                        !isEmotionMode && styles.modeButtonTextActive
                                    ]}>
                                        글쓰기
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.modeButton,
                                        styles.rightModeButton,
                                        isEmotionMode && styles.modeButtonActive
                                    ]}
                                    onPress={enterEmotionMode}
                                >
                                    <Icon name="sentiment-satisfied" size={16} color={isEmotionMode ? "#FFFFFF" : "#E57373"} />
                                    <Text style={[
                                        styles.modeButtonText,
                                        isEmotionMode && styles.modeButtonTextActive
                                    ]}>
                                        감정 선택
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
                            <Text style={styles.saveButtonText}>작성 완료</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 날짜 표시 */}
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{getTodayDate()}</Text>
                </View>

                {/* 제목 입력 영역 */}
                <View style={styles.titleContainer}>
                    <TextInput
                        ref={titleInputRef}
                        style={styles.titleInput}
                        placeholder="오늘의 일기 제목을 입력하세요"
                        placeholderTextColor="#999999"
                        value={title}
                        onChangeText={handleTitleChange}
                        maxLength={50}
                        selectionColor="#E57373"
                    />
                </View>

                {/* 에디터 영역 */}
                <View style={styles.editorContainer}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                        {renderEditor()}
                    </ScrollView>
                </View>

                {/* 감정 분석 리스트 */}
                {emotionSegments.length > 0 && (
                    <View style={styles.emotionAnalysis}>
                        <View style={styles.emotionAnalysisHeader}>
                            <Text style={styles.emotionAnalysisTitle}>감정 통계</Text>
                            <View style={styles.emotionCount}>
                                <Text style={styles.emotionCountText}>{emotionSegments.length}</Text>
                            </View>
                        </View>

                        <ScrollView style={styles.emotionList} showsVerticalScrollIndicator={false}>
                            {[...emotionSegments]
                                .sort((a, b) => a.start - b.start) // 위치별 오름차순 정렬
                                .map((segment, index) => (
                                    <TouchableOpacity
                                        key={segment.id}
                                        style={styles.emotionListItem}
                                        onPress={() => editEmotion(segment)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.emotionListLeft}>
                                            <View style={[
                                                styles.emotionIndicator,
                                                { backgroundColor: segment.emotionColor }
                                            ]}>
                                                <Text style={styles.emotionIndicatorText}>
                                                    {segment.emotionName}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.emotionListRight}>
                                            <Text style={styles.emotionSentence} numberOfLines={2}>
                                                "{segment.text}"
                                            </Text>
                                            <View style={styles.emotionListMeta}>
                                                <Text style={styles.emotionPosition}>
                                                    위치: {segment.start + 1} ~ {segment.end}
                                                </Text>
                                                <Icon name="edit" size={14} color="#999999" />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </View>
                )}

                {/* 하단 선택 텍스트 바 */}
                {showBottomSelectionBar && (
                    <Animated.View
                        style={[
                            styles.bottomSelectionBar,
                            {
                                transform: [
                                    {
                                        translateY: bottomBarAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [100, 0],
                                        }),
                                    },
                                ],
                                opacity: bottomBarAnimation,
                            },
                        ]}
                    >
                        <View style={styles.bottomSelectionContent}>
                            <View style={styles.selectedTextInfo}>
                                <Icon name="format-quote" size={16} color="#666666" />
                                <Text style={styles.bottomSelectionText} numberOfLines={2}>
                                    선택된 텍스트: "{selectedText}"
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.bottomEmotionButton}
                                onPress={openEmotionModal}
                            >
                                <Icon name="sentiment-satisfied" size={18} color="#FFFFFF" />
                                <Text style={styles.bottomEmotionButtonText}>감정 선택</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

                {/* 감정 선택 모달 */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={emotionModalVisible}
                    onRequestClose={closeEmotionModal}
                >
                    <TouchableWithoutFeedback onPress={closeEmotionModal}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.emotionModalContainer}>
                                    <View style={styles.emotionModalHeader}>
                                        <Text style={styles.emotionModalTitle}>
                                            {isEditingEmotion ? '감정 수정하기' : '이 문장에 대한 감정 선택'}
                                        </Text>
                                        <TouchableOpacity onPress={closeEmotionModal}>
                                            <Icon name="close" size={24} color="#666666" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* 선택된 텍스트 표시 */}
                                    <View style={styles.selectedTextContainer}>
                                        <Text style={styles.selectedTextLabel}>선택된 문장:</Text>
                                        <Text style={styles.selectedTextDisplay}>"{selectedText}"</Text>
                                    </View>

                                    {/* 감정 그리드 */}
                                    <ScrollView
                                        ref={emotionScrollRef}
                                        style={styles.emotionGrid}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View style={styles.emotionGridContent}>
                                            {emotions.map(renderEmotionCard)}
                                        </View>
                                    </ScrollView>

                                    {/* 선택된 감정 정보 */}
                                    {selectedEmotion && (
                                        <View style={styles.selectedEmotionInfo}>
                                            <View style={[styles.selectedEmotionPreview, { backgroundColor: selectedEmotion.color }]}>
                                                <Text style={styles.selectedEmotionName}>{selectedEmotion.name}</Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* 수정된 버튼들 - 삭제 버튼 추가 */}
                                    <View style={styles.emotionModalButtons}>
                                        <TouchableOpacity
                                            style={styles.emotionCancelButton}
                                            onPress={closeEmotionModal}
                                        >
                                            <Text style={styles.emotionCancelButtonText}>취소</Text>
                                        </TouchableOpacity>

                                        {/* 수정 모드일 때만 삭제 버튼 표시 */}
                                        {isEditingEmotion && (
                                            <TouchableOpacity
                                                style={styles.emotionDeleteButton}
                                                onPress={deleteEmotionFromModal}
                                            >
                                                <Icon name="delete" size={16} color="#FFFFFF" />
                                                <Text style={styles.emotionDeleteButtonText}>삭제</Text>
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity
                                            style={[
                                                styles.emotionApplyButton,
                                                !selectedEmotion && styles.emotionApplyButtonDisabled
                                            ]}
                                            onPress={applyEmotion}
                                            disabled={!selectedEmotion}
                                        >
                                            <Text style={styles.emotionApplyButtonText}>
                                                {isEditingEmotion ? '수정' : '적용'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: 10,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // 모드 버튼 스타일들
    modeButtons: {
        flexDirection: 'row',
        marginRight: 10,
    },
    modeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E57373',
    },
    leftModeButton: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderRightWidth: 0,
    },
    rightModeButton: {
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderLeftWidth: 0,
    },
    modeButtonActive: {
        backgroundColor: '#E57373',
    },
    modeButtonText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
        color: '#E57373',
    },
    modeButtonTextActive: {
        color: '#FFFFFF',
    },

    saveButton: {
        backgroundColor: '#E57373',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    dateContainer: {
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    dateText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E57373',
    },

    // 제목 관련 스타일
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        paddingVertical: 12,
    },

    editorContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 15,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: '#333333',
        textAlignVertical: 'top',
        minHeight: 200,
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0,
    },

    // 하이브리드 관련 스타일들
    hybridContainer: {
        position: 'relative',
        minHeight: 200,
        flex: 1,
    },
    hybridInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        color: 'transparent',
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'top',
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0,
    },
    styledOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0,
    },
    styledTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    styledText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333333',
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0,
    },

    // 감정 세그먼트 스타일
    emotionSegmentContainer: {
        position: 'relative',
        alignItems: 'flex-start',
    },
    emotionSegmentTouchable: {
        // 터치 영역 최소화
    },
    emotionText: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderRadius: 3,
        marginHorizontal: 0,
        marginVertical: 0,
    },
    emotionTag: {
        position: 'absolute',
        top: -12,
        right: -4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        zIndex: 10,
    },
    emotionTagText: {
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: 'bold',
    },

    // 하단 선택 바 스타일
    bottomSelectionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingHorizontal: 20,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    bottomSelectionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectedTextInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    bottomSelectionText: {
        flex: 1,
        fontSize: 13,
        color: '#666666',
        fontStyle: 'italic',
        marginLeft: 8,
    },
    bottomEmotionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E57373',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    bottomEmotionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },

    // 감정 통계 스타일
    emotionStats: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FAFAFA',
    },
    emotionStatsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    emotionChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
    },
    emotionChipText: {
        fontSize: 12,
        fontWeight: '500',
    },

    // 감정 모달 스타일
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    emotionModalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
        maxHeight: height * 0.8,
        minHeight: height * 0.6,
    },
    emotionModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    emotionModalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    selectedTextContainer: {
        backgroundColor: '#F8F8F8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectedTextLabel: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
    },
    selectedTextDisplay: {
        fontSize: 14,
        color: '#333333',
        fontStyle: 'italic',
    },

    // 감정 그리드 스타일
    emotionGrid: {
        flex: 1,
        marginBottom: 16,
    },
    emotionGridContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    emotionCard: {
        borderRadius: 12,
        margin: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    emotionCardTouchArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        position: 'relative',
    },
    emotionCardText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '800',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    selectedBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedBadgeText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '700',
    },

    // 선택된 감정 정보
    selectedEmotionInfo: {
        alignItems: 'center',
        marginBottom: 16,
    },
    selectedEmotionPreview: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedEmotionName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    // 수정된 모달 버튼들
    emotionModalButtons: {
        flexDirection: 'row',
        paddingBottom: 30,
    },
    emotionCancelButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        marginRight: 4,
    },
    emotionCancelButtonText: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '500',
    },
    // 삭제 버튼 스타일
    emotionDeleteButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        marginHorizontal: 4,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    emotionDeleteButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    emotionApplyButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#E57373',
        borderRadius: 12,
        marginLeft: 4,
    },
    emotionApplyButtonDisabled: {
        backgroundColor: '#D0D0D0',
    },
    emotionApplyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // 기존 emotionStats 관련 스타일들을 제거하고 다음으로 교체
    // 감정 분석 리스트 스타일
    emotionAnalysis: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FAFAFA',
        maxHeight: 200, // 최대 높이 설정으로 스크롤 가능
    },
    emotionAnalysisHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    emotionAnalysisTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    emotionCount: {
        backgroundColor: '#E57373',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    emotionCountText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    emotionList: {
        maxHeight: 140,
    },
    emotionListItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    emotionListLeft: {
        marginRight: 12,
        justifyContent: 'flex-start',
    },
    emotionIndicator: {
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        minWidth: 60,
        alignItems: 'center',
    },
    emotionIndicatorText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    emotionListRight: {
        flex: 1,
        justifyContent: 'space-between',
    },
    emotionSentence: {
        fontSize: 14,
        color: '#333333',
        lineHeight: 20,
        marginBottom: 4,
    },
    emotionListMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emotionPosition: {
        fontSize: 11,
        color: '#999999',
    },
    absoluteEmotionTag: {
        position: 'absolute',
        top: -8,
        left: -2,
        paddingHorizontal: 3,
        paddingVertical: 1,
        borderRadius: 4,
        zIndex: 100,
        // 텍스트 플로우에 완전히 영향을 주지 않는 절대 위치
    },

    absoluteEmotionTagText: {
        color: '#FFFFFF',
        fontSize: 7,
        fontWeight: 'bold',
    },
});

export default Recoding;

