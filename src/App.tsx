import './styles/App.css';

function App() {
    return (
        <div className="container">
            <div>
                <h1 className="text-4xl font-bold mb-8">Route Calculator</h1>
            </div>
            <div className="grid grid-cols-3 gap-8">
                <ul className="space-y-1 text-left">
                    <li className="text-primary-50">primary-50</li>
                    <li className="text-primary-100">primary-100</li>
                    <li className="text-primary-200">primary-200</li>
                    <li className="text-primary-300">primary-300</li>
                    <li className="text-primary-400">primary-400</li>
                    <li className="text-primary-500">primary-500</li>
                    <li className="text-primary-600">primary-600</li>
                    <li className="text-primary-700">primary-700</li>
                    <li className="text-primary-800">primary-800</li>
                    <li className="text-primary-900">primary-900</li>
                    <li className="text-primary-950">primary-950</li>
                </ul>

                <ul className="space-y-1 text-left">
                    <li className="text-accent-50">accent-50</li>
                    <li className="text-accent-100">accent-100</li>
                    <li className="text-accent-200">accent-200</li>
                    <li className="text-accent-300">accent-300</li>
                    <li className="text-accent-400">accent-400</li>
                    <li className="text-accent-500">accent-500</li>
                    <li className="text-accent-600">accent-600</li>
                    <li className="text-accent-700">accent-700</li>
                    <li className="text-accent-800">accent-800</li>
                    <li className="text-accent-900">accent-900</li>
                </ul>

                <ul className="space-y-1 text-left">
                    <li className="text-success-500">success-500</li>
                    <li className="text-success-600">success-600</li>
                    <li className="text-warning-500">warning-500</li>
                    <li className="text-warning-600">warning-600</li>
                    <li className="text-error-500">error-500</li>
                    <li className="text-error-600">error-600</li>
                    <li className="text-neutral-400">neutral-400</li>
                    <li className="text-neutral-500">neutral-500</li>
                    <li className="text-neutral-600">neutral-600</li>
                    <li className="text-neutral-700">neutral-700</li>
                    <li className="text-content-base">content-base</li>
                    <li className="text-content-muted">content-muted</li>
                    <li className="text-content-faint">content-faint</li>
                </ul>
            </div>
        </div>
    );
}

export default App;
