import { Users, CalendarDays, MessageSquare, Activity, ChevronRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- EMPTY DATA (Chờ tích hợp API thực) ---
const chatActivityData = [];

const religionDistributionData = [];

const COLORS = ['#2A1610', '#CAA46A', '#A3684B', '#DFD3C3'];

const recentQuestions = [];

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2A1610]">Tổng quan hệ thống</h1>
        <p className="mt-1 text-sm text-gray-500">Giám sát hoạt động của E-SPIRIT và Trợ lý Tâm Linh AI.</p>
      </div>

      {/* 1. TOP SECTION (KPI Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Users */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng người dùng</p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-gray-900">1,245</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="font-medium text-emerald-600">+12%</span>
            <span className="ml-2 text-gray-500">so với tháng trước</span>
          </div>
        </div>

        {/* Card 2: Events */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Sự kiện & Bài viết</p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-gray-900">156</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <CalendarDays size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="font-medium text-emerald-600">+5</span>
            <span className="ml-2 text-gray-500">bài mới tuần này</span>
          </div>
        </div>

        {/* Card 3: Chatbot Queries */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lượt hỏi Chatbot</p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-gray-900">36,750</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAF5EC] text-[#2A1610]">
              <MessageSquare size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="font-medium text-emerald-600">Tăng vọt</span>
            <span className="ml-2 text-gray-500">do sắp Rằm tháng 7</span>
          </div>
        </div>

        {/* Card 4: Active Users */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Đang truy cập</p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-gray-900">56</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Activity size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="relative mr-2 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-emerald-600 font-medium">Real-time status</span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION (Charts) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line Chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] lg:col-span-2">
          <h3 className="mb-6 font-serif text-lg font-bold text-[#2A1610]">Lượng tương tác Chatbot 7 ngày qua</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chatActivityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#2A1610', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="queries"
                  name="Lượt hỏi"
                  stroke="#2A1610"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2A1610', strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: '#FAF5EC', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] lg:col-span-1">
          <h3 className="mb-6 font-serif text-lg font-bold text-[#2A1610]">Phân loại Sự kiện & Kiến thức</h3>
          <div className="h-[300px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={religionDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {religionDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#2A1610', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              {religionDistributionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs text-gray-600">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION (Recent Activity) */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="font-serif text-lg font-bold text-[#2A1610]">Các câu hỏi Chatbot mới nhất</h3>
          <button className="flex items-center gap-1 text-sm font-medium text-[#2A1610] hover:text-[#1A0D09] transition-colors">
            Xem tất cả lịch sử <ChevronRight size={16} />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {recentQuestions.map((q) => (
            <div key={q.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-gray-50/50 -mx-6 px-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF5EC] text-[#CAA46A]">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{q.question}</p>
                  <p className="text-sm text-gray-500">Hỏi bởi: <span className="font-medium text-gray-700">{q.user}</span></p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-400 sm:text-right mt-2 sm:mt-0">
                {q.time}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
