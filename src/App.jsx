import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <>
      {/* Khởi tạo Toaster ở Root để gọi toast() ở bất kỳ đâu */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#ffffff',
            color: '#333333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f3f4f6'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <AppRoutes />
    </>
  )
}
