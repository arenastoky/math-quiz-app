if (!window.React || !window.ReactDOM || !window.Babel) {
  document.getElementById('root').innerHTML = '<div style="color: red; text-align: center;">無法載入資源，請檢查網絡</div>';
  throw new Error('Dependencies missing');
}

function MathApp() {
  const [grade, setGrade] = React.useState('');
  const [topic, setTopic] = React.useState('');
  const [questions, setQuestions] = React.useState([]);
  const [showAnswers, setShowAnswers] = React.useState(false);
  const [error, setError] = React.useState('');
  const [answers, setAnswers] = React.useState({});
  const [feedback, setFeedback] = React.useState({});

  const grades = ['4年級', '5年級', '6年級'];
  const topicsByGrade = {
    '4年級': ['乘法與除法', '分數運算', '面積與周界'],
    '5年級': ['分數進階', '小數運算', '代數基礎'],
    '6年級': ['小數與百分數', '簡易方程', '圓面積']
  };

  const generateQuestions = async () => {
    try {
      if (!grade || !topic) {
        setError('請選擇年級同課題');
        return;
      }
      setError('');
      const newQuestions = [];
      const maxNum = parseInt(grade) * 50 || 200;

      for (let i = 0; i < 10; i++) {
        let question = '', answer = '';
        if (topic === '乘法與除法') {
          const num1 = Math.floor(Math.random() * maxNum) + 10;
          const num2 = Math.floor(Math.random() * 90) + 10;
          question = `${num1} × ${num2} = ?`;
          answer = (num1 * num2).toString();
        } else if (topic === '分數運算') {
          const denom = Math.floor(Math.random() * 10) + 2;
          const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
          const num2 = Math.floor(Math.random() * (denom - 1)) + 1;
          question = `${num1}/${denom} + ${num2}/${denom} = ?`;
          const sum = num1 + num2;
          answer = sum >= denom ? `${Math.floor(sum/denom)} ${sum%denom}/${denom}` : `${sum}/${denom}`;
        } else if (topic === '面積與周界') {
          const length = Math.floor(Math.random() * 20) + 5;
          const width = Math.floor(Math.random() * 20) + 5;
          question = `長方形長 ${length} 厘米，寬 ${width} 厘米，面積係？`;
          answer = `${length * width} 平方厘米`;
        } else if (topic === '分數進階') {
          const num1 = Math.floor(Math.random() * 10) + 1;
          const denom1 = Math.floor(Math.random() * 10) + 2;
          const num2 = Math.floor(Math.random() * 10) + 1;
          const denom2 = Math.floor(Math.random() * 10) + 2;
          question = `${num1}/${denom1} × ${num2}/${denom2} = ?`;
          const productNum = num1 * num2;
          const productDenom = denom1 * denom2;
          const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
          answer = `${productNum/gcd(productNum, productDenom)}/${productDenom/gcd(productNum, productDenom)}`;
        } else if (topic === '小數運算') {
          const num1 = (Math.random() * 10).toFixed(3);
          const num2 = (Math.random() * 10).toFixed(3);
          question = `${num1} + ${num2} = ?`;
          answer = (parseFloat(num1) + parseFloat(num2)).toFixed(3);
        } else if (topic === '代數基礎') {
          const coef = Math.floor(Math.random() * 5) + 1;
          const constant = Math.floor(Math.random() * 20) + 1;
          question = `解方程：${coef}x = ${constant}`;
          answer = `${constant/coef}`;
        } else if (topic === '小數與百分數') {
          const num = (Math.random() * 100).toFixed(2);
          question = `將 ${num} 轉為百分數`;
          answer = `${(parseFloat(num) * 100).toFixed(2)}%`;
        } else if (topic === '簡易方程') {
          const x = Math.floor(Math.random() * 10) + 1;
          const coef = Math.floor(Math.random() * 5) + 1;
          const constant = Math.floor(Math.random() * 20) + 1;
          question = `解方程：${coef}x + ${constant} = ${constant + coef * x}`;
          answer = `${x}`;
        } else if (topic === '圓面積') {
          const radius = Math.floor(Math.random() * 10) + 1;
          question = `圓半徑 ${radius} 厘米，面積係？（用 π ≈ 3.14）`;
          answer = `${(3.14 * radius * radius).toFixed(2)} 平方厘米`;
        }
        newQuestions.push({ question, answer });
      }
      setQuestions(newQuestions);
      setAnswers({});
      setFeedback({});
    } catch (err) {
      console.error('錯誤:', err.message);
      setError('生成題目出錯，請再試');
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
    setFeedback({ ...feedback, [index]: '' });
  };

  const checkAnswers = () => {
    try {
      const newFeedback = {};
      questions.forEach((q, index) => {
        const userAnswer = answers[index] ? answers[index].trim() : '';
        const correctAnswer = q.answer;
        if (userAnswer === '') {
          newFeedback[index] = { message: '請輸入答案', isCorrect: false };
        } else if (userAnswer === correctAnswer) {
          newFeedback[index] = { message: '答啱晒！', isCorrect: true };
        } else {
          newFeedback[index] = { message: `唔啱，答案係 ${correctAnswer}`, isCorrect: false };
        }
      });
      setFeedback(newFeedback);
    } catch (err) {
      console.error('檢查錯誤:', err.message);
      setError('檢查答案出錯，請再試');
    }
  };

  return (
    <div className="app">
      <h1 className="title">數學題目APP</h1>
      {error && <div className="error">{error}</div>}
      <div className="select-box">
        <select value={grade} onChange={(e) => { setGrade(e.target.value); setTopic(''); setError(''); }}>
          <option value="">選擇年級</option>
          {grades.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={topic} onChange={(e) => { setTopic(e.target.value); setError(''); }} disabled={!grade}>
          <option value="">選擇課題</option>
          {grade && topicsByGrade[grade]?.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <button onClick={generateQuestions} disabled={!grade || !topic} className="generate-btn">生成10道題</button>
      <button onClick={() => setShowAnswers(!showAnswers)} className="toggle-btn">{showAnswers ? '隱藏答案' : '顯示答案'}</button>
      <button onClick={checkAnswers} className="check-btn">檢查答案</button>
      {questions.length > 0 && (
        <div className="questions">
          <h2 className="question-title">題目：</h2>
          <ul>
            {questions.map((q, index) => (
              <li key={index}>
                {index + 1}. {q.question}
                <input
                  type="text"
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="輸入答案"
                />
                {feedback[index] && (
                  <div className={`feedback ${feedback[index].isCorrect ? '' : 'error'}`}>
                    {feedback[index].message}
                  </div>
                )}
                {showAnswers && <div>答案: {q.answer}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<MathApp />);
} catch (err) {
  console.error('載入錯誤:', err.message);
  document.getElementById('root').innerHTML = '<div style="color: red; text-align: center;">程式載入失敗，請檢查網絡</div>';
}