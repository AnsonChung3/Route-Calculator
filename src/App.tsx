import './styles/App.css';
import MapCanvas from './components/MapCanvas';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

function App() {
    return (
        <div className="container">
            <h1 className="text-4xl font-bold mb-8">Route Calculator</h1>
            <MapCanvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
        </div>
    );
}

export default App;
