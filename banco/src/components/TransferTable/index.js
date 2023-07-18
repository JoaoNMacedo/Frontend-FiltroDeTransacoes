import React from 'react';
import { Table } from 'react-bootstrap';
import './styles.css';

class TransferTable extends React.Component {
  render() {
    const { transferencias } = this.props;

    const formatarData = (data) => {
      const dateObj = new Date(data);
      const dia = dateObj.getDate();
      const mes = dateObj.getMonth() + 1;
      const ano = dateObj.getFullYear();
  
      const diaFormatado = dia < 10 ? `0${dia}` : dia;
      const mesFormatado = mes < 10 ? `0${mes}` : mes;
  
      return `${diaFormatado}/${mesFormatado}/${ano}`;
    };

    const formatarValorMonetario = (valor) => {
      const valorAbsoluto = Math.abs(valor);
      const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }).format(valorAbsoluto);
  
      return valor < 0 ? '-' + valorFormatado : valorFormatado;
    };

    return (
      <div>
        <Table className="Table">
          <thead>
            <tr className='TopTableItens'>
            <th>Dados</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Nome do operador transacionado</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transferencias) && transferencias.length > 0 ? (
              transferencias.map(transferencia => (
                <tr key={transferencia.id}>
                  <td>{formatarData(transferencia.dataTransferencia)}</td>
                  <td>{formatarValorMonetario(transferencia.valor)}</td>
                  <td>{transferencia.tipo}</td>
                  <td>{transferencia.nomeOperadorTransacao}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nenhum dado de transferência disponível.</td>
              </tr>
            )}
          </tbody>
          <div className='AllItems'>Total de itens: {transferencias.length}</div>
        </Table>
        
      </div>
    );
  }
}

export default TransferTable;
