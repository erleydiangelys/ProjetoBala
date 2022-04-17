
import './dashboard.css';
import { useState, useEffect, useContext } from 'react';

import Header from '../../componentes/Header';
import Title from '../../componentes/Title';
import Modal from '../../componentes/Modal';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { GrFormViewHide, GrFormView } from "react-icons/gr";

import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { AuthContext } from '../../contexts/auth';

import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard(){
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();
  const [addNovoPedido, setAddNovoPedido] = useState('');
  const [viewID, setViewID] = useState(false);

  const { user } = useContext(AuthContext);

  const selID = [];

  useEffect(() => {
  
    loadChamados();

    return () => {};
  }, []);

  async function loadChamados() {
    await listRef
      .limit(10)
      .get()
      .then((snapshot) => {
        updateState(snapshot);
      })
      .catch((err) => {
        console.log("Deu algum erro: ", err);
        setLoadingMore(false);
      });

    setLoading(false);
  }


  async function updateState(snapshot){
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
          prevDataEntrega: format(doc.data().prevDataEntrega.toDate(), 'dd/MM/yyyy'),
          localEntrega: doc.data().localEntrega,
          userId: doc.data().userId,

        })
      })

      const lastDoc = snapshot.docs[snapshot.docs.length -1]; //Pegando o ultimo documento buscado
      
      setChamados(chamados => [...chamados, ...lista]);
      setLastDocs(lastDoc);

    }else{
      setIsEmpty(true);
    }

    setLoadingMore(false);

  }


  async function handleMore(){
    setLoadingMore(true);
    await listRef.startAfter(lastDocs).limit(5)
    .get()
    .then((snapshot)=>{
      updateState(snapshot)
    })
  }

  function toglePostModal(item){
    setDetail(item);
    setShowPostModal(!showPostModal);
  }

  async function addPedido(){
    await listRef
    .get()
    .then(async(snapshot)=>{
      await snapshot.forEach((doc)=>{
        if(doc.id === addNovoPedido){
          selID.push(doc.id)
           firebase.firestore().collection('chamados')
            .doc(doc.id)
            .update({
              userId: user.uid,
            })
            .then(()=>{
              loadChamados();
              setAddNovoPedido('');
              toast.success('Pedido adicionado com sucesso!')
            })
        }
      })
    })

  }
 

  if(loading){
    return(
      <div>
        <Header/>

        <div className="content">
          <Title name="Atendimentos">
            <FiMessageSquare size={25} />
          </Title>  

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>

        </div>      
      </div>
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length  === 0  ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

        
          <Link to="/new" className="new">
          <FiPlus size={25} color="#FFF" />
          Novo Pedido
        </Link>
            
          </div>
        )  : user.tipo === 'admin' ? (
          <>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo Pedido
            </Link>

            <table>
              <thead>
                <tr>
                {user.tipo === 'admin' && <th scope="col">ID:</th>}
                  <th scope="col">Cliente</th>
                  <th scope="col">Tipo produto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Previsão Entrega</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((item, index)=>{
                  if(user.tipo === 'admin' || item.userId == user.uid){
                  return(
  
                   <tr key={index}>
                     {user.tipo === 'admin' && viewID ? (<td data-label="Cliente">
                     <GrFormView size={20} onClick={()=>setViewID(false)}/> {item.id} </td>) :
                     (<td data-label="Cliente"><GrFormViewHide size={17} onClick={()=>setViewID(true)}/></td>)}
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span className="badge"
                         style={{ backgroundColor: item.status === 'Aberto' ? '#FF5733' :
                                (item.status === 'Progresso' ? '#FFF833' :
                                 (item.status === 'Feito' ? '#33FFC3' : '#5FFF33')) }}>{item.status}</span>
                      </td>
                      <td data-label="Cadastrado">{item.prevDataEntrega}</td>
                      <td data-label="#">
                        <button className="action"
                         style={{backgroundColor: '#3583f6' }} onClick={()=> toglePostModal(item)}>
                          <FiSearch color="#FFF" size={17} />
                        </button>
                        <Link className="action" style={{backgroundColor: '#F6a935' }} to={`/new/${item.id}`}>
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                      </td>
                    </tr>
                  )}
                })}
              </tbody>
            </table>
            <div className='btn-container'>
    
              <div className='add-pedido'>
                <input type="text" placeholder="Numero do pedido" onChange={(e)=> setAddNovoPedido(e.target.value)}/>
                <button className="btn-add" onClick={addPedido}>Adicionar pedido</button>
              </div>

              {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
              { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button> }

            </div>

          </>
            ) : (
              <>
            <table>
              <thead>
                <tr>
                  {user.tipo === 'admin' &&
                   <th scope="col">ID:</th>}
                  <th scope="col">Cliente</th>
                  <th scope="col">Tipo produto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Previsão Entrega</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((item, index)=>{
                  if(item.userId == user.uid && user.tipo === 'cliente'){
                  return(
  
                   <tr key={index}>
                     {user.tipo === 'admin' &&
                      <td data-label="Cliente">{item.id}</td>}
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span className="badge"
                         style={{ backgroundColor: item.status === 'Aberto' ? '#FF5733' :
                                (item.status === 'Progresso' ? '#FFF833' :
                                 (item.status === 'Feito' ? '#33FFC3' : '#5FFF33')) }}>{item.status}</span>
                      </td>
                      <td data-label="Cadastrado">{item.prevDataEntrega}</td>
                      <td data-label="#">
                        <button className="action"
                         style={{backgroundColor: '#3583f6' }} onClick={()=> toglePostModal(item)}>
                          <FiSearch color="#FFF" size={17} />
                        </button>
                        {user.tipo === 'admin' &&
                        <Link className="action" style={{backgroundColor: '#F6a935' }} to={`/new/${item.id}`}>
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                    }
                      </td>
                    </tr>
                  )}
                })}
              </tbody>
            </table>
            <div className='btn-container'>
    
              <div className='add-pedido'>
                <input type="text" placeholder="Numero do pedido" onChange={(e)=> setAddNovoPedido(e.target.value)}/>
                <button className="btn-add" onClick={addPedido}>Adicionar pedido</button>
              </div>

              {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
              { !loadingMore && selID.length > 9 && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button> }

            </div>
          </>
  )}

      </div>

      {showPostModal && (
        <Modal
          conteudo={detail}
          close={toglePostModal}
        />)}

    </div>
  )
}