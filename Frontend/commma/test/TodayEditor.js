// TodayEditor.js
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TodayEditor = () => {
  // 기존 state들...
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [inputFontSize, setInputFontSize] = useState('16');
  const [currentTextStyle, setCurrentTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontSize: 16,
    color: '#000000',
    backgroundColor: 'transparent'
  });
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [styledSegments, setStyledSegments] = useState([]);
  const [isDecorationMode, setIsDecorationMode] = useState(false);

  // 수정된 state - renderMode 제거하고 isDecorationMode만 사용
  const textInputRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
  if (styledSegments.length > 0) {
    // 디바운스를 위해 약간의 지연 후 검증
    const timeoutId = setTimeout(() => {
      validateAndUpdateSegments();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }
}, [content, styledSegments]);

  // 기존 함수들 유지...
  const getTodayDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[today.getDay()];
    return `${month}월 ${day}일 ${weekday}`;
  };

  const handleBackPress = () => {
    console.log('뒤로가기 버튼 클릭됨');
  };

  const handleSavePress = () => {
    console.log('일기 제목:', title);
    console.log('일기 저장:', content);
    console.log('스타일된 텍스트 세그먼트:', styledSegments);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  // 글쓰기 모드로 전환
  // 모드 전환 시에도 세그먼트 동기화 확인
  const enterWriteMode = () => {
    setIsDecorationMode(false);
    // 현재 content와 segments가 동기화되어 있는지 확인하고 필요시 업데이트
    validateAndUpdateSegments();
  };

  // 꾸미기 모드로 전환 (하이브리드 방식)
  const enterDecorationMode = () => {
    setIsDecorationMode(true);
    if (textInputRef.current) {
      textInputRef.current.blur();
    }
    // 꾸미기 모드 진입 시에도 세그먼트 유효성 검사
    validateAndUpdateSegments();
  };

  // 세그먼트 유효성 검사 및 업데이트 함수 추가
  const validateAndUpdateSegments = () => {
    const validSegments = styledSegments.filter(segment => {
      // 세그먼트의 위치가 현재 텍스트 길이를 벗어나지 않는지 확인
      if (segment.end > content.length) {
        return false;
      }

      // 세그먼트의 텍스트가 실제 해당 위치의 텍스트와 일치하는지 확인
      const actualText = content.slice(segment.start, segment.end);
      return actualText === segment.text;
    });

    // 유효하지 않은 세그먼트가 있었다면 업데이트
    if (validSegments.length !== styledSegments.length) {
      setStyledSegments(validSegments);
    }
  };

  const handleTextChange = (newText) => {
    const oldText = content;
    setContent(newText);

    // 텍스트가 변경되었을 때 기존 스타일 세그먼트들을 업데이트
    if (styledSegments.length > 0) {
      updateSegmentsAfterTextChange(oldText, newText);
    }
  };

  // 텍스트 변경 후 세그먼트 업데이트 함수 추가
  const updateSegmentsAfterTextChange = (oldText, newText) => {
    const updatedSegments = [];

    styledSegments.forEach(segment => {
      const segmentText = segment.text;
      const newIndex = newText.indexOf(segmentText);

      // 세그먼트의 텍스트가 새로운 텍스트에 여전히 존재하는 경우
      if (newIndex !== -1) {
        // 동일한 텍스트가 여러 개 있을 수 있으므로 위치를 고려해서 가장 가까운 위치 찾기
        let bestIndex = newIndex;
        let minDistance = Math.abs(segment.start - newIndex);

        // 같은 텍스트가 여러 번 나타나는 경우 원래 위치와 가장 가까운 것 선택
        let searchIndex = newIndex;
        while ((searchIndex = newText.indexOf(segmentText, searchIndex + 1)) !== -1) {
          const distance = Math.abs(segment.start - searchIndex);
          if (distance < minDistance) {
            minDistance = distance;
            bestIndex = searchIndex;
          }
        }

        // 세그먼트 위치 업데이트
        const updatedSegment = {
          ...segment,
          start: bestIndex,
          end: bestIndex + segmentText.length
        };

        // 업데이트된 위치가 유효한 범위 내에 있는지 확인
        if (updatedSegment.end <= newText.length) {
          updatedSegments.push(updatedSegment);
        }
      }
      // 세그먼트의 텍스트가 새로운 텍스트에 없으면 해당 세그먼트는 제거됨
    });

    setStyledSegments(updatedSegments);
  };

  // 숫자 입력 관련 새 함수들 추가
  const handleFontSizeInputChange = (text) => {
    setInputFontSize(text);
  };

  const applyFontSizeFromInput = () => {
    const size = parseInt(inputFontSize);
    if (size >= 8 && size <= 72) {
      changeFontSize(size);
      setShowNumberInput(false);
    }
  };

  // 수정된 스타일 적용 함수
  const applyStyleToSelection = (styleProperty, styleValue) => {
    if (selectionStart === selectionEnd) {
      // 선택 영역이 없으면 현재 스타일만 업데이트
      setCurrentTextStyle(prev => ({ ...prev, [styleProperty]: styleValue }));
      return;
    }

    const selectedText = content.slice(selectionStart, selectionEnd);

    // 선택된 영역과 겹치는 모든 세그먼트 제거
    const filteredSegments = styledSegments.filter(segment =>
      !(segment.start < selectionEnd && segment.end > selectionStart)
    );

    // 새로운 스타일 세그먼트 생성 (현재 선택된 텍스트의 기존 스타일 기반)
    const newSegment = {
      text: selectedText,
      start: selectionStart,
      end: selectionEnd,
      // 현재 텍스트 스타일을 기반으로 새로운 스타일 생성
      bold: styleProperty === 'bold' ? styleValue : currentTextStyle.bold,
      italic: styleProperty === 'italic' ? styleValue : currentTextStyle.italic,
      underline: styleProperty === 'underline' ? styleValue : currentTextStyle.underline,
      strikethrough: styleProperty === 'strikethrough' ? styleValue : currentTextStyle.strikethrough,
      fontSize: styleProperty === 'fontSize' ? styleValue : currentTextStyle.fontSize,
      color: styleProperty === 'color' ? styleValue : currentTextStyle.color,
      backgroundColor: styleProperty === 'backgroundColor' ? styleValue : currentTextStyle.backgroundColor,
    };

    setStyledSegments([...filteredSegments, newSegment]);
    setCurrentTextStyle(prev => ({ ...prev, [styleProperty]: styleValue }));

    console.log(`${styleProperty} 적용됨:`, selectedText, styleValue);
  };

  // 기존 토글 함수들 유지...
  const toggleBold = () => {
    const newValue = !currentTextStyle.bold;
    applyStyleToSelection('bold', newValue);
  };

  const toggleItalic = () => {
    const newValue = !currentTextStyle.italic;
    applyStyleToSelection('italic', newValue);
  };

  const toggleUnderline = () => {
    const newValue = !currentTextStyle.underline;
    applyStyleToSelection('underline', newValue);
  };

  const toggleStrikethrough = () => {
    const newValue = !currentTextStyle.strikethrough;
    applyStyleToSelection('strikethrough', newValue);
  };

  const changeFontSize = (size) => {
    applyStyleToSelection('fontSize', size);
  };

  const changeTextColor = (color) => {
    applyStyleToSelection('color', color);
  };

  const changeBackgroundColor = (backgroundColor) => {
    applyStyleToSelection('backgroundColor', backgroundColor);
  };

  const handleSelectionChange = (event) => {
    const { start, end } = event.nativeEvent.selection;
    setSelectionStart(start);
    setSelectionEnd(end);

    if (start !== end) {
      // 선택된 영역과 겹치는 세그먼트들을 찾기
      const overlappingSegments = styledSegments.filter(segment =>
        !(segment.end <= start || segment.start >= end) // 겹치는 세그먼트 찾기
      );

      if (overlappingSegments.length > 0) {
        // 가장 최근에 적용된 (또는 가장 작은 범위의) 세그먼트 선택
        const targetSegment = overlappingSegments.reduce((prev, current) => {
          const prevSize = prev.end - prev.start;
          const currentSize = current.end - current.start;
          return currentSize <= prevSize ? current : prev;
        });

        // 해당 세그먼트의 스타일을 현재 스타일로 설정
        setCurrentTextStyle({
          bold: targetSegment.bold || false,
          italic: targetSegment.italic || false,
          underline: targetSegment.underline || false,
          strikethrough: targetSegment.strikethrough || false,
          fontSize: targetSegment.fontSize || 16,
          color: targetSegment.color || '#000000',
          backgroundColor: targetSegment.backgroundColor || 'transparent'
        });
      } else {
        // 겹치는 세그먼트가 없으면 기본 스타일로 초기화
        setCurrentTextStyle({
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          fontSize: 16,
          color: '#000000',
          backgroundColor: 'transparent'
        });
      }
    } else {
      // 선택 영역이 없으면 커서 위치의 스타일 확인
      const cursorSegment = styledSegments.find(segment =>
        start >= segment.start && start <= segment.end
      );

      if (cursorSegment) {
        setCurrentTextStyle({
          bold: cursorSegment.bold || false,
          italic: cursorSegment.italic || false,
          underline: cursorSegment.underline || false,
          strikethrough: cursorSegment.strikethrough || false,
          fontSize: cursorSegment.fontSize || 16,
          color: cursorSegment.color || '#000000',
          backgroundColor: cursorSegment.backgroundColor || 'transparent'
        });
      } else {
        // 스타일이 적용되지 않은 영역이면 기본값으로 초기화
        setCurrentTextStyle({
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          fontSize: 16,
          color: '#000000',
          backgroundColor: 'transparent'
        });
      }
    }
  };

  // 기존 렌더링 함수 유지...
  const renderStyledText = () => {
    if (styledSegments.length === 0) {
      return (
        <Text style={styles.styledText}>
          {content}
        </Text>
      );
    }

    const sortedSegments = [...styledSegments].sort((a, b) => a.start - b.start);
    const renderedElements = [];
    let currentIndex = 0;

    sortedSegments.forEach((segment, index) => {
      if (currentIndex < segment.start) {
        renderedElements.push(
          <Text key={`text-${index}-before`} style={styles.styledText}>
            {content.slice(currentIndex, segment.start)}
          </Text>
        );
      }

      const segmentStyle = {
        fontWeight: segment.bold ? 'bold' : 'normal',
        fontStyle: segment.italic ? 'italic' : 'normal',
        textDecorationLine: (() => {
          const decorations = [];
          if (segment.underline) decorations.push('underline');
          if (segment.strikethrough) decorations.push('line-through');
          return decorations.length > 0 ? decorations.join(' ') : 'none';
        })(),
        fontSize: segment.fontSize || 16,
        color: segment.color || '#333333',
        backgroundColor: segment.backgroundColor === 'transparent' ? 'transparent' : segment.backgroundColor,
      };

      renderedElements.push(
        <Text key={`segment-${index}`} style={[styles.styledText, segmentStyle]}>
          {segment.text}
        </Text>
      );

      currentIndex = segment.end;
    });

    if (currentIndex < content.length) {
      renderedElements.push(
        <Text key="text-final" style={styles.styledText}>
          {content.slice(currentIndex)}
        </Text>
      );
    }

    return <View style={styles.styledTextContainer}>{renderedElements}</View>;
  };

  // 수정된 에디터 렌더링 - 꾸미기 모드일 때 하이브리드 방식 사용
  const renderEditor = () => {
    if (!isDecorationMode) {
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
      // 꾸미기 모드 (하이브리드 방식)
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

  // 기존 컴포넌트들 유지...
  const ToolbarButton = ({ onPress, isActive, icon, style }) => (
    <TouchableOpacity
      style={[
        styles.toolbarButton,
        isActive && styles.toolbarButtonActive,
        style
      ]}
      onPress={onPress}
    >
      <Icon
        name={icon}
        size={20}
        color={isActive ? '#FFFFFF' : '#333333'}
      />
    </TouchableOpacity>
  );

  const ColorButton = ({ color, onPress, isActive }) => (
    <TouchableOpacity
      style={[
        styles.colorButton,
        { backgroundColor: color === 'transparent' ? '#FFFFFF' : color },
        color === 'transparent' && { borderStyle: 'dashed' },
        isActive && styles.colorButtonActive
      ]}
      onPress={onPress}
    />
  );

  // NumberInput 컴포넌트 추가
  const NumberInput = () => (
    <View style={styles.numberInputContainer}>
      <TextInput
        style={styles.numberInput}
        value={inputFontSize}
        onChangeText={handleFontSizeInputChange}
        keyboardType="numeric"
        maxLength={2}
        autoFocus={true}
        selectionColor="#E57373"
      />
      <TouchableOpacity
        style={styles.numberInputApply}
        onPress={applyFontSizeFromInput}
      >
        <Icon name="check" size={16} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.numberInputCancel}
        onPress={() => setShowNumberInput(false)}
      >
        <Icon name="close" size={16} color="#666666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        {/* 수정된 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon
              name="arrow-back"
              size={24}
              color="#333333"
            />
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            {/* 글쓰기/꾸미기 토글 버튼 */}
            {content.length > 0 && (
              <View style={styles.modeButtons}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    styles.leftModeButton,
                    !isDecorationMode && styles.modeButtonActive
                  ]}
                  onPress={enterWriteMode}
                >
                  <Icon name="edit" size={16} color={!isDecorationMode ? "#FFFFFF" : "#E57373"} />
                  <Text style={[
                    styles.modeButtonText,
                    !isDecorationMode && styles.modeButtonTextActive
                  ]}>
                    글쓰기
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    styles.rightModeButton,
                    isDecorationMode && styles.modeButtonActive
                  ]}
                  onPress={enterDecorationMode}
                >
                  <Icon name="format-paint" size={16} color={isDecorationMode ? "#FFFFFF" : "#E57373"} />
                  <Text style={[
                    styles.modeButtonText,
                    isDecorationMode && styles.modeButtonTextActive
                  ]}>
                    꾸미기
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

        {/* 선택된 텍스트 정보 - 더 상세한 정보 표시 */}
        {isDecorationMode && selectionStart !== selectionEnd && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              선택된 텍스트: "{content.slice(selectionStart, selectionEnd)}"
            </Text>
            <Text style={styles.selectionStyleText}>
              현재 스타일: {currentTextStyle.bold && '굵게 '}
              {currentTextStyle.italic && '기울임 '}
              {currentTextStyle.underline && '밑줄 '}
              {currentTextStyle.strikethrough && '취소선 '}
              {currentTextStyle.fontSize}pt {' '}
              {currentTextStyle.backgroundColor !== 'transparent' && '배경색 적용'}
            </Text>
          </View>
        )}

        {/* 에디터 영역 */}
        <View style={[styles.editorContainer, isDecorationMode && styles.editorContainerDecoration]}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {renderEditor()}
          </ScrollView>
        </View>

        {/* 수정된 2줄 툴바 - 꾸미기 모드에서만 표시 */}
        {isDecorationMode && (
          <View style={styles.toolbar}>
            {/* 첫 번째 줄 - 기본 서식 */}
            <View style={styles.toolbarRow}>
              <ToolbarButton
                icon="format-bold"
                isActive={currentTextStyle.bold}
                onPress={toggleBold}
              />
              <ToolbarButton
                icon="format-italic"
                isActive={currentTextStyle.italic}
                onPress={toggleItalic}
              />
              <ToolbarButton
                icon="format-underlined"
                isActive={currentTextStyle.underline}
                onPress={toggleUnderline}
              />
              <ToolbarButton
                icon="format-strikethrough"
                isActive={currentTextStyle.strikethrough}
                onPress={toggleStrikethrough}
              />

              <View style={styles.separator} />

              {/* 글자 크기 - 숫자 입력 방식 */}
              {showNumberInput ? (
                <NumberInput />
              ) : (
                <TouchableOpacity
                  style={[styles.fontSizeButton, styles.fontSizeInputButton]}
                  onPress={() => {
                    setInputFontSize(currentTextStyle.fontSize.toString());
                    setShowNumberInput(true);
                  }}
                >
                  <Text style={styles.fontSizeText}>
                    {currentTextStyle.fontSize}pt
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 두 번째 줄 - 색상 */}
            <View style={styles.toolbarRow}>
              <Text style={styles.toolbarLabel}>A</Text>
              <ColorButton
                color="#000000"
                isActive={currentTextStyle.color === '#000000'}
                onPress={() => changeTextColor('#000000')}
              />
              <ColorButton
                color="#FF0000"
                isActive={currentTextStyle.color === '#FF0000'}
                onPress={() => changeTextColor('#FF0000')}
              />
              <ColorButton
                color="#0000FF"
                isActive={currentTextStyle.color === '#0000FF'}
                onPress={() => changeTextColor('#0000FF')}
              />
              <ColorButton
                color="#008000"
                isActive={currentTextStyle.color === '#008000'}
                onPress={() => changeTextColor('#008000')}
              />

              <View style={styles.separator} />

              <Icon name="format-color-fill" size={16} color="#333333" style={styles.backgroundColorIcon} />
              <ColorButton
                color="transparent"
                isActive={currentTextStyle.backgroundColor === 'transparent'}
                onPress={() => changeBackgroundColor('transparent')}
              />
              <ColorButton
                color="#FFFF00"
                isActive={currentTextStyle.backgroundColor === '#FFFF00'}
                onPress={() => changeBackgroundColor('#FFFF00')}
              />
              <ColorButton
                color="#FFB6C1"
                isActive={currentTextStyle.backgroundColor === '#FFB6C1'}
                onPress={() => changeBackgroundColor('#FFB6C1')}
              />
              <ColorButton
                color="#90EE90"
                isActive={currentTextStyle.backgroundColor === '#90EE90'}
                onPress={() => changeBackgroundColor('#90EE90')}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 스타일 정의
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
    paddingBottom: 15,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    paddingVertical: 12,
  },

  selectionInfo: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#F0F0F0',
  },
  selectionText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  selectionStyleText: {
    fontSize: 11,
    color: '#888888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  editorContainerDecoration: {
    paddingBottom: 120,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textAlignVertical: 'top',
    minHeight: 200,
    backgroundColor: 'transparent',
  },

  // 하이브리드 관련 스타일들
  hybridContainer: {
    position: 'relative',
    minHeight: 200,
    borderRadius: 8,
    padding: 10,
  },
  hybridInput: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    zIndex: 1,
    color: 'transparent',
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  styledOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    zIndex: 2,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  styledTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  styledText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },

  // 수정된 툴바 스타일들
  toolbar: {
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toolbarButtonActive: {
    backgroundColor: '#E57373',
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  fontSizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fontSizeInputButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fontSizeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  colorButtonActive: {
    borderColor: '#E57373',
    borderWidth: 3,
  },
  toolbarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  backgroundColorIcon: {
    marginRight: 8,
  },

  // 숫자 입력 관련 새 스타일들
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numberInput: {
    width: 40,
    fontSize: 14,
    textAlign: 'center',
    color: '#333333',
    paddingVertical: 4,
  },
  numberInputApply: {
    backgroundColor: '#E57373',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  numberInputCancel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});

export default TodayEditor;
