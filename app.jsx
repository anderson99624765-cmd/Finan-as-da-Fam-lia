import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  DollarSign, 
  Wallet, 
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Lock,
  LogOut,
  Sparkles,
  Loader2
} from 'lucide-react';

const DEFAULT_EXPENSES = [
  { id: '1', name: 'Conta de Água', amount: 0 },
  { id: '2', name: 'Conta de Energia', amount: 0 },
  { id: '3', name: 'Internet', amount: 0 },
  { id: '4', name: 'Mercado', amount: 0 },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const ExpenseItem = ({ expense, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(expense.name);
  const [editAmount, setEditAmount] = useState(expense.amount);

  const handleSave = () => {
    if (!editName.trim()) return;
    onUpdate({
      ...expense,
      name: editName,
      amount: parseFloat(editAmount) || 0
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(expense.name);
    setEditAmount(expense.amount);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 items-center p-4 bg-white rounded-xl shadow-sm border border-emerald-100 mb-3 transition-all">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="flex-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          placeholder="Nome do gasto"
          autoFocus
        />
        <div className="flex w-full sm:w-auto items-center gap-2">
          <span className="text-gray-500 font-medium">R$</span>
          <input
            type="number"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            className="w-full sm:w-32 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
          <button onClick={handleSave} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors" title="Salvar">
            <Save size={18} />
          </button>
          <button onClick={handleCancel} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Cancelar">
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-all group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
          <TrendingDown size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{expense.name}</h3>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-800 text-lg">
          {formatCurrency(expense.amount)}
        </span>
        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Editar">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(expense.id)} className="p-2 text-gray-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50" title="Excluir">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('familyAppAuth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // State for expenses
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('familyExpenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_EXPENSES;
      }
    }
    return DEFAULT_EXPENSES;
  });

  // State for income
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem('familyIncome');
    return saved ? parseFloat(saved) : 0;
  });

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [editIncomeValue, setEditIncomeValue] = useState(income);

  // State for AI Analysis
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');

  // State for new expense form
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('familyExpenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('familyIncome', income.toString());
  }, [income]);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - totalExpenses;

  const handleAddExpense = (e) => {
    e.preventDefault();
    setError('');

    if (!newName.trim()) {
      setError('Por favor, dê um nome para o gasto.');
      return;
    }

    const amount = parseFloat(newAmount) || 0;

    const newExpense = {
      id: Date.now().toString(),
      name: newName,
      amount: amount
    };

    setExpenses([...expenses, newExpense]);
    setNewName('');
    setNewAmount('');
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses(expenses.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    ));
  };

  const handleDeleteExpense = (id) => {
    // We don't use confirm/alert based on instructions, so we delete directly. 
    // A more advanced app might have a custom modal here.
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleAnalyzeFinances = async () => {
    setIsAnalyzing(true);
    setAiError('');
    setAiAnalysis('');

    try {
      const expenseListText = expenses.map(e => `- ${e.name}: ${formatCurrency(e.amount)}`).join('\n');
      const prompt = `Analise as seguintes finanças familiares e dê 3 dicas práticas e diretas para melhorar a saúde financeira ou economizar. Seja gentil e encorajador. Destaque os pontos positivos também.
      
Renda Mensal: ${formatCurrency(income)}
Gastos Totais: ${formatCurrency(totalExpenses)}
Saldo Restante: ${formatCurrency(balance)}

Lista de Gastos:
${expenseListText || 'Nenhum gasto registrado.'}`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
          parts: [{ text: "Você é um consultor financeiro familiar brasileiro, amigável e especialista em economia doméstica. Forneça respostas curtas, claras e estruturadas em parágrafos simples. Evite marcações complexas, responda em texto limpo com quebras de linha." }]
        }
      };

      const apiKey = ""; // A chave da API será providenciada automaticamente pelo Canvas
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        setAiAnalysis(result.candidates[0].content.parts[0].text);
      } else {
        throw new Error('Formato de resposta inesperado da IA.');
      }
    } catch (err) {
      console.error(err);
      setAiError('Não foi possível gerar a análise no momento. Tente novamente mais tarde.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveIncome = () => {
    setIncome(parseFloat(editIncomeValue) || 0);
    setIsEditingIncome(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
  
    if (passwordInput === 'isis1379') { 
      setIsAuthenticated(true);
      localStorage.setItem('familyAppAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Senha incorreta. Tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('familyAppAuth');
    setPasswordInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Acesso Restrito</h1>
          <p className="text-center text-gray-500 mb-8">Digite a senha de administrador para acessar as finanças da família.</p>
          
          {loginError && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Entrar
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-6">Senha padrão: <strong>isis1379</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 pb-20">
      {/* Header section */}
      <header className="bg-emerald-600 text-white pt-8 pb-24 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Wallet size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Finanças da Família</h1>
              <p className="text-emerald-100 text-sm">Organize o dinheiro da casa de forma simples</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-16">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Income Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <TrendingUp size={18} className="text-emerald-500" />
                Renda Mensal
              </div>
              {!isEditingIncome && (
                <button onClick={() => { setIsEditingIncome(true); setEditIncomeValue(income); }} className="text-gray-400 hover:text-emerald-600 transition-colors">
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            
            {isEditingIncome ? (
              <div className="flex gap-2 items-center">
                <span className="text-gray-500 font-medium">R$</span>
                <input
                  type="number"
                  value={editIncomeValue}
                  onChange={(e) => setEditIncomeValue(e.target.value)}
                  className="w-full p-1 border-b-2 border-emerald-500 focus:outline-none text-2xl font-bold text-gray-800 bg-transparent"
                  autoFocus
                />
                <button onClick={handleSaveIncome} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200">
                  <Save size={16} />
                </button>
              </div>
            ) : (
              <div className="text-3xl font-bold text-gray-800">
                {formatCurrency(income)}
              </div>
            )}
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-gray-500 font-medium mb-4">
              <TrendingDown size={18} className="text-rose-500" />
              Gastos Totais
            </div>
            <div className="text-3xl font-bold text-rose-500">
              {formatCurrency(totalExpenses)}
            </div>
          </div>

          {/* Balance Card */}
          <div className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between ${balance >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <div className={`flex items-center gap-2 font-medium mb-4 ${balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              <DollarSign size={18} />
              Saldo Restante
            </div>
            <div className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {formatCurrency(balance)}
            </div>
          </div>
        </div>

        {/* AI Financial Analysis Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-[1px] rounded-2xl shadow-sm mb-8">
          <div className="bg-white rounded-2xl p-6 h-full w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="text-indigo-500" size={24} />
                  Conselheiro IA
                </h2>
                <p className="text-gray-500 text-sm mt-1">Receba dicas personalizadas com base nos seus dados atuais.</p>
              </div>
              <button
                onClick={handleAnalyzeFinances}
                disabled={isAnalyzing}
                className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analisar Finanças
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="p-4 bg-rose-50 text-rose-700 rounded-xl flex items-start gap-3 text-sm mt-6">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{aiError}</p>
              </div>
            )}

            {aiAnalysis && !isAnalyzing && (
              <div className="mt-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={100} />
                </div>
                <div className="prose prose-indigo max-w-none relative z-10">
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {aiAnalysis}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Adicionar Novo Gasto</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Gasto</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Aluguel, Farmácia..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-600 mb-1">Valor (R$)</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={20} />
                Adicionar
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">Lista de Gastos</h2>
          
          {expenses.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Wallet size={32} />
              </div>
              <h3 className="text-gray-800 font-medium mb-1">Nenhum gasto cadastrado</h3>
              <p className="text-gray-500 text-sm">Adicione seus gastos fixos e variáveis acima.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {expenses.map(expense => (
                <ExpenseItem 
                  key={expense.id} 
                  expense={expense} 
                  onUpdate={handleUpdateExpense}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}