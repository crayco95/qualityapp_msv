# Quality App - Arquitectura del Frontend

## Tabla de Contenidos
- [Introducción](#introducción)
- [Tecnologías](#tecnologías)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Componentes Principales](#componentes-principales)
- [Gestión de Estado](#gestión-de-estado)
- [Routing](#routing)
- [Servicios API](#servicios-api)
- [Estilos y Temas](#estilos-y-temas)
- [Patrones de Desarrollo](#patrones-de-desarrollo)

## Introducción

El frontend de Quality App está construido con React 18+ y TypeScript, siguiendo las mejores prácticas de desarrollo moderno. La aplicación utiliza un diseño component-based con gestión de estado mediante Context API.

## Tecnologías

### Core
- **React 18.2+**: Framework principal
- **TypeScript 4.9+**: Tipado estático
- **React Router 6**: Navegación SPA
- **Axios**: Cliente HTTP

### UI/UX
- **Tailwind CSS**: Framework de estilos
- **Lucide React**: Iconografía
- **React Toastify**: Notificaciones
- **React Hook Form**: Gestión de formularios

### Desarrollo
- **Vite**: Build tool y dev server
- **ESLint**: Linting de código
- **Prettier**: Formateo de código

## Estructura de Carpetas

```
src/
├── components/           # Componentes reutilizables
│   ├── Layout/          # Componentes de layout
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── Modal/           # Componentes de modal
│   │   └── Modal.tsx
│   ├── Forms/           # Formularios específicos
│   │   ├── EvaluationForm/
│   │   ├── SoftwareForm/
│   │   └── StandardForm/
│   └── Common/          # Componentes comunes
│       ├── Button.tsx
│       ├── Input.tsx
│       └── LoadingSpinner.tsx
│
├── contexts/            # Contextos React
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── pages/              # Páginas principales
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── EvaluationManagement.tsx
│   ├── EvaluationProcess.tsx
│   ├── SoftwareManagement.tsx
│   ├── StandardManagement.tsx
│   └── ClassificationManagement.tsx
│
├── services/           # Servicios y API
│   ├── api.ts
│   ├── auth.ts
│   └── storage.ts
│
├── types/              # Definiciones de tipos
│   ├── standard.ts
│   ├── user.ts
│   └── api.ts
│
├── utils/              # Utilidades
│   ├── dateUtils.ts
│   ├── formatUtils.ts
│   └── validationUtils.ts
│
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── useLocalStorage.ts
│
└── styles/             # Estilos globales
    ├── globals.css
    └── components.css
```

## Componentes Principales

### Layout Components

#### MainLayout
```typescript
interface MainLayoutProps {
  title?: string;
  children: React.ReactNode;
}

// Proporciona estructura base con sidebar y header
const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  // Implementación del layout principal
};
```

#### Sidebar
```typescript
// Navegación lateral con rutas dinámicas basadas en roles
const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  // Renderiza menú según permisos del usuario
};
```

### Form Components

#### EvaluationForm
```typescript
interface EvaluationFormProps {
  evaluation?: Assessment;
  softwares: Software[];
  standards: Standard[];
  onSubmit: (data: AssessmentFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

// Formulario para crear/editar evaluaciones
const EvaluationForm: React.FC<EvaluationFormProps> = (props) => {
  // Implementación con React Hook Form
};
```

### Page Components

#### EvaluationProcess
```typescript
// Componente para el proceso guiado de evaluación
const EvaluationProcess: React.FC = () => {
  const { softwareId, standardId } = useParams();
  
  // Estado para navegación entre parámetros
  const [currentParameterIndex, setCurrentParameterIndex] = useState(0);
  
  // Lógica de evaluación paso a paso
};
```

## Gestión de Estado

### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Estado Local
```typescript
// Uso de useState para estado de componente
const [evaluations, setEvaluations] = useState<Assessment[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Custom hooks para lógica reutilizable
const useApi = <T>(apiCall: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Implementación del hook
};
```

## Routing

### Configuración de Rutas
```typescript
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/evaluations" element={
            <ProtectedRoute>
              <EvaluationManagement />
            </ProtectedRoute>
          } />
          <Route path="/evaluations/process/:softwareId/:standardId" element={
            <ProtectedRoute>
              <EvaluationProcess />
            </ProtectedRoute>
          } />
          {/* Más rutas... */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
```

### Protección de Rutas
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'evaluator' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
};
```

## Servicios API

### Cliente HTTP Base
```typescript
// Configuración de Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout automático en caso de token expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Servicios Específicos
```typescript
export const assessmentService = {
  getAll: () => api.get('/assessment/assessments'),
  create: (data: AssessmentFormData) => api.post('/assessment/assessments', data),
  getById: (id: string) => api.get(`/assessment/assessments/${id}`),
  update: (id: string, data: Partial<AssessmentFormData>) => 
    api.put(`/assessment/assessments/${id}`, data),
  delete: (id: string) => api.delete(`/assessment/assessments/${id}`),
};

export const reportService = {
  generateAssessmentReport: (assessmentId: string) => 
    api.get(`/report/reports/assessment/${assessmentId}`, {
      responseType: 'blob'
    }),
  generateSoftwareReport: (softwareId: string) => 
    api.get(`/report/reports/software/${softwareId}`, {
      responseType: 'blob'
    }),
};
```

## Estilos y Temas

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Más colores personalizados
      },
    },
  },
  plugins: [],
};
```

### Clases CSS Personalizadas
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }
  
  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
}
```

## Patrones de Desarrollo

### Custom Hooks
```typescript
// useApi.ts - Hook para llamadas API
export const useApi = <T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};
```

### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>Ha ocurrido un error inesperado.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Lazy Loading
```typescript
// Carga perezosa de componentes
const EvaluationManagement = lazy(() => import('./pages/EvaluationManagement'));
const SoftwareManagement = lazy(() => import('./pages/SoftwareManagement'));

// Uso con Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/evaluations" element={<EvaluationManagement />} />
    <Route path="/software" element={<SoftwareManagement />} />
  </Routes>
</Suspense>
```

### Optimización de Rendimiento
```typescript
// Memoización de componentes
const ExpensiveComponent = memo(({ data }: { data: ComplexData }) => {
  return <div>{/* Renderizado complejo */}</div>;
});

// Memoización de valores calculados
const MemoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Callbacks memoizados
const handleClick = useCallback((id: number) => {
  onItemClick(id);
}, [onItemClick]);
```
