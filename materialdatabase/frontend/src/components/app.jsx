// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import messages from './translations';

const App = () => {
  const [locale, setLocale] = useState('de');

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <Router>
        <div className="app">
          <nav>
            <select value={locale} onChange={(e) => setLocale(e.target.value)}>
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </nav>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/materials" component={MaterialsList} />
            <Route path="/materials/new" component={MaterialForm} />
            {/* Weitere Routes */}
          </Switch>
        </div>
      </Router>
    </IntlProvider>
  );
};

// MaterialForm.jsx
const MaterialForm = () => {
  const [formData, setFormData] = useState({
    type: 'M',
    name: '',
    dimensions: {
      length: 1,
      width: 1,
      thickness: 0
    },
    manufacturer: '',
    lambda_value: '',
    mu_dry: '',
    mu_wet: '',
    sd_value: '',
    vkf_class: '',
    load_value: '',
    ubp_id: '',
    unit: '',
    price: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Handle success
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={formData.type}
        onChange={e => setFormData({...formData, type: e.target.value})}
      >
        <option value="M">Material</option>
        <option value="P">Produkt</option>
      </select>

      <input
        type="text"
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
        placeholder="Bezeichnung"
      />

      {/* Weitere Formularfelder */}
      
      <button type="submit">Speichern</button>
    </form>
  );
};

// MaterialsList.jsx
const MaterialsList = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchItems();
  }, [searchTerm, filters]);

  const fetchItems = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/items?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Suchen..."
      />
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bezeichnung</th>
            <th>Hersteller</th>
            {/* Weitere Spalten */}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.manufacturer}</td>
              {/* Weitere Spalten */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};