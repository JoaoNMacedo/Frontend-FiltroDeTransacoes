import React, { useState, useEffect } from 'react';
import './styles.css';
import Header from '../../components/Header';
import TransferTable from '../../components/TransferTable';

function TransferScreen() {
  const [transferencias, setTransferencias] = useState([]);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [saldoTotalFixo, setSaldoTotalFixo] = useState(0);

  const handleSearch = () => {
    const dataInicioElement = document.getElementById('dataInicioInput');
    const dataFinalElement = document.getElementById('dataFinalInput');
    const nomeOperador = document.getElementById('nomeOperador');

    const queryParams = [];
    if (dataInicioElement.value) {
      const dataInicio = new Date(dataInicioElement.value).toISOString();
      queryParams.push(`dataInicial=${dataInicio}`);
    }
    if (dataFinalElement.value) {
      const dataFinal = new Date(dataFinalElement.value).toISOString();
      queryParams.push(`dataFinal=${dataFinal}`);
    }
    if (nomeOperador.value) {
      queryParams.push(`nomeOperadorTransacao=${nomeOperador.value}`);
    }

    const query = queryParams.join('&');
    const url = `http://localhost:8080/transferencias${queryParams.length > 0 ? '?' + query : ''}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setTransferencias(data);
        calculateSaldoTotal(data);
      })
      .catch(error => {
        console.error('Erro ao obter os dados da API', error);
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.toString()) {
      fetch('http://localhost:8080/transferencias')
        .then(response => response.json())
        .then(data => {
          setTransferencias(data);
          calculateSaldoTotal(data);
          calculateSaldoTotalFixo(data);
        })
        .catch(error => {
          console.error('Erro ao obter os dados da API', error);
        });
    }
  }, []);

  const calculateSaldoTotal = data => {
    const saldo = data.reduce((total, transferencia) => total + transferencia.valor, 0);
    setSaldoTotal(saldo);
  };

  const calculateSaldoTotalFixo = data => {
    const saldoFixo = data.reduce((total, transferencia) => total + transferencia.valor, 0);
    setSaldoTotalFixo(saldoFixo);
  };

  const formatCurrency = value => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="Container">
      <div className="Header">
        <Header />
      </div>

      <div className="FilterContainer">
        <div className="FilterBox">
          <div className="TextContainer">
            <p>Data Inicial</p>
            <input type="date" className="FilterInput" id="dataInicioInput" />
          </div>
          <div className="TextContainer">
            <p>Data Final</p>
            <input type="date" className="FilterInput" id="dataFinalInput" />
          </div>
          <div className="TextContainer">
            <p>Nome do Operador</p>
            <input className="FilterInput" id="nomeOperador" placeholder="Digite um nome" />
          </div>
        </div>
      </div>

      <div className="ButtonContainer">
        <button className="SearchButton" onClick={handleSearch}>
          Pesquisar
        </button>
      </div>
      <div className='Saldos'>
        <div className='TextSaldo'>Saldo Total: {formatCurrency(saldoTotalFixo)}</div>
        <div className='TextSaldo'>Saldo no período: {formatCurrency(saldoTotal)}</div>
      </div>
      <div className="Desktop2">
        <TransferTable transferencias={transferencias} />
      </div>
    </div>
  );
}

export default TransferScreen;
