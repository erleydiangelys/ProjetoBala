
import { useState, useEffect, useContext } from 'react';

import firebase from '../../services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom';

import Header from '../../componentes/Header';
import Title from '../../componentes/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import './new.css';
import { FiPlusCircle } from 'react-icons/fi'

export default function New(){
  const { id } = useParams();
  const history = useHistory();

  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [assunto, setAssunto] = useState('Forro');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const [dataentrega, setDataentrega] = useState('');
  const [localEntrega, setLocalEntrega] = useState('');

  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);


  useEffect(()=> {
    async function loadCustomers(){
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot)=>{
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if(lista.length === 0){
          console.log('NENHUMA EMPRESA ENCONTRADA');
          setCustomers([ { id: '1', nomeFantasia: 'FREELA' } ]);
          setLoadCustomers(false);
          return;
        }

        setCustomers(lista);
        setLoadCustomers(false);

        if(id){
          loadId(lista);
        }

      })
      .catch((error)=>{
        console.log('DEU ALGUM ERRO!', error);
        setLoadCustomers(false);
        setCustomers([ { id: '1', nomeFantasia: '' } ]);
      })

    }

    loadCustomers();

  }, [id]);



  async function loadId(lista){
    await firebase.firestore().collection('chamados').doc(id)
    .get()
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento)

      let index = lista.findIndex(item => item.id === snapshot.data().clienteId );
      setCustomerSelected(index);
      setIdCustomer(true);

    })
    .catch((err)=>{
      console.log('ERRO NO ID PASSADO: ', err);
      setIdCustomer(false);
    })
  }

  async function handleRegister(e){
    e.preventDefault();

    if(idCustomer){
      await firebase.firestore().collection('chamados')
      .doc(id)
      .update({
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid,
        prevDataEntrega: new Date(dataentrega),
        localEntrega: localEntrega
      })
      .then(()=>{
        toast.success('Chamado Editado com sucesso!');
        setCustomerSelected(0);
        setComplemento('');
        history.push('/dashboard');
      })
      .catch((err)=>{
        toast.error('Ops erro ao registrar, tente mais tarde.')
        console.log(err);
      })

      return;
    }

    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid,
      prevDataEntrega: new Date(dataentrega),
      localEntrega: localEntrega
    })
    .then(()=> {
      toast.success('Chamado criado com sucesso!');
      setComplemento('');
      setCustomerSelected(0);
    })
    .catch((err)=> {
      toast.error('Ops erro ao registrar, tente mais tarde.')
      console.log(err);
    })


  }


  //Chamado quando troca o assunto
  function handleChangeSelect(e){
    setAssunto(e.target.value);
  }


  //Chamado quando troca o status
  function handleOptionChange(e){
    setStatus(e.target.value);
  }

  //Chamado quando troca de cliente
  function handleChangeCustomers(e){
    //console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
    //console.log('Cliente selecionado ', customers[e.target.value])
    setCustomerSelected(e.target.value);
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">

          <form className="form-profile"  onSubmit={handleRegister} >
            
            <label>Cliente</label>

            {loadCustomers ? (
              <input type="text" disabled={true} value="Carregando clientes..." />
            ) : (
                <select value={customerSelected} onChange={handleChangeCustomers} >
                {customers.map((item, index) => {
                  return(
                    <option key={item.id} value={index} >
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Forro">Forro</option>
              <option value="Anilhas">Anilhas</option>
              <option value="Outros">Outros</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input 
              type="radio"
              name="radio"
              value="Aberto"
              onChange={handleOptionChange}
              checked={ status === 'Aberto' }
              />
              <span>Em Aberto</span>

              <input 
              type="radio"
              name="radio"
              value="Progresso"
              onChange={handleOptionChange}
              checked={ status === 'Progresso' }
              />
              <span>Em processo</span>

              <input 
              type="radio"
              name="radio"
              value="Feito"
              onChange={handleOptionChange}
              checked={ status === 'Feito' }
              />
              <span>Feito</span>

              <input 
              type="radio"
              name="radio"
              value="Entregue"
              onChange={handleOptionChange}
              checked={ status === 'Entregue' }
              />
              <span>Entregue</span>

            </div>
            
            <label>Previsão de entrega</label>
            <input type="date"
              value={dataentrega}
              onChange={ (e) => setDataentrega(e.target.value) }
            />

            <label>Endereço de entrega</label>
            <textarea
              type="text"
              placeholder="Local onde deverá ser entregue o produto"
              value={localEntrega}
              onChange={ (e) => setLocalEntrega(e.target.value) }
            />
            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva as Observações sobre o Pedido (opcional)."
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />
            
            <button type="submit">Registrar</button>

          </form>

        </div>

      </div>
    </div>
  )
}