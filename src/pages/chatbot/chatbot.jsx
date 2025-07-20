import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);

  // 이전 페이지에서 받아온 placeName을 고정값으로 유지
  const placeName = location.state?.placeName || '';

  const mockAnswer = `강남역 근처 일식집을 찾았습니다. 
갓덴스시 강남점(초밥,롤), 이춘복참치&스시 강남점(참치회), 
큰물참치 강남점(참치회), 참치공방 강남점(참치회), 
우동명가 기리야마본진(돈까스,우동)이 있습니다. 
이 중에서 어떤 종류의 일식집에 대해 더 자세한 정보를 원하시나요?\n`;

  // 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = async () => {
    if (!placeName.trim()) {
      setError('장소 정보가 누락되었습니다.');
      return;
    }

    if (!question.trim()) {
      setError('질문을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    // 유저 메시지 추가
    setMessages(prev => [...prev, { type: 'user', text: question }]);

    try {
      const response = await axios.post(
        '/chatbot/ask',
        { placeName, question },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessages(prev => [...prev, { type: 'bot', text: response.data.answer }]);
    } catch (err) {
      console.error('API 요청 오류:', err);
      if (err.response?.status === 404) {
        setMessages(prev => [...prev, { type: 'bot', text: mockAnswer }]);
      } else {
        setError('서버 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  return (
    <>
      <div className='headerC'>
        <button className='back-button' onClick={() => navigate(-1)}>
          <img src="/assets/BackButton.png" alt="뒤로가기" />
        </button>
        <p className="p-con">챗봇에게 목적지 정보 물어보기</p>
      </div>

      <div className="chat-container">

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} style={{ margin: 0 }}>{line}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <textarea
            className="chat-textarea"
            placeholder="무엇이든 물어보세요!"
            rows={1}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            disabled={loading}
          />

          <button
            className="chat-button"
            onClick={handleAsk}
            disabled={loading}
          >
            <img src="/assets/chat-question.png" alt="질문하기" className="send-icon" />
          </button>
        </div>

        {error && (
          <div className="chat-error">
            <strong>⚠️ 오류:</strong> {error}
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;