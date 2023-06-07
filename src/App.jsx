import { useState, useEffect } from 'react'

import paises from './paises.json'
import imagenLuisito from './assets/images/luisito.png';
import './assets/main.scss'

function App() {

  const [buscador, setBuscador]  = useState([])
  const paisesVisistados = {
    total: [] ,
    porcentaje: 0,
    America: [] ,
    Europa: [] ,
    Asia: [] ,
    Oceania: [] ,
    Africa: [] ,
  }

  // Calcular la cantidad de paises visitados en cada continente
  paises.continentes.forEach(c => {
    c.paises.sort((a, b) => b.visitado  - a.visitado)
    c.paises.forEach(pais => {
      if(pais.visitado) {
        const nombreContinente = pais.continente 
        paisesVisistados.total.push(pais)
        paisesVisistados[nombreContinente].push(pais)
      }
    })
  })
  // Eliminar repeticion de paises transcontinentales para el total
  paisesVisistados.total = paisesVisistados.total.reduce((accumulator, current) => {
    if (!accumulator.find(item => item.nombre === current.nombre)) {
      accumulator.push(current);
    }
    return accumulator;
  }, [] )

  // Calcular porcentaje de paises visitados
  paisesVisistados.porcentaje = parseFloat(((paisesVisistados.total.length * 100) / 195).toFixed()) 

  function handleSearch(e) {
    let search = e.target.value.toLocaleLowerCase()
    search = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    const tempResults = []

    if(search !== '' && search.length > 1) {
      paises.continentes.forEach(conti => {
        conti.paises.forEach(pais => {
          if(pais.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(search)) {
            if(!tempResults.find(item => item.nombre === pais.nombre)) {
              tempResults.push(pais)
            }          
          }
        })
      })

      if(tempResults.length === 0) {
        tempResults.push({
          nombre: `No se econtraron resultados para: ${search}`,
          bandera: '🤷‍♂️'
        })
        setBuscador(tempResults)
    
      } else {
        tempResults.sort((a, b) => b.visitado - a.visitado )
        setBuscador(tempResults)
      }
    } else {
      setBuscador(tempResults)
    }
  }

  // Manejar minimización de continentes en movil
  function handleToggle(continente) {
    if(matchMedia('(max-width: 1200px)').matches) {
      const listado = document.querySelector(`#paises_${continente}`) 
      listado.classList.toggle('hide')
    }
  }

  return (
    <main className="main-page">
      { /* NAVBAR */ }
      <nav className="main-navbar navbar navbar-expand-lg bg-dark">
        <div className="container-fluid justify-content-start">
          <div className="d-flex justify-content-between align-items-center w-100-lg">
            <a className="navbar-brand" href="/que-paises-ha-visitado-luisito-comunica-react"><img className="img-fluid" src={imagenLuisito}/></a>
            <ul className="navbar-nav d-flex flex-row d-lg-none">
              <li className="nav-item">
                <a className="nav-link active" href="https://github.com/Emilianoac/que-paises-ha-vistado-luisito-comunica-react" target="_blank">
                  <i className="fab fa-github"></i>
                </a>
              </li>
            </ul>
          </div>

          { /* BUSCADOR */ } 
          <form className="d-flex w-100 mt-1" role="search">
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-search"></i></span>
              <input 
                onChange={handleSearch}
                type="search" 
                className="form-control" 
                placeholder="Buscar pais" 
              />
            </div>

            { /* RESULTADOS */ } 
            {buscador.length > 0 &&
              <div className="resultados-busquedas">
                <ul>
                  {buscador.map((pais) => (
                    <li className="resultado" key={pais.nombre + 'resultado_busqueda'}>
                      {pais.visitado ?
                        <a 
                          className="resultado__contenido" 
                          href={pais.video}
                          target="_blank" 
                          title="Ir Al video">
                            <span> 
                              <img className="me-2" src={pais.bandera.imagen}/>
                              { pais.nombre }
                            </span>
                            <i className="fas fa-check text-success"></i>
                        </a>
                        :
                        <div className="resultado__contenido" title="No visitado aún">
                          <span> 
                            <img className="me-2" src={pais.bandera.imagen}/>
                            { pais.nombre }
                          </span>
                          <i className="fas fa-times-circle text-danger"></i>
                        </div>
                      }
                    </li>
                  ))}
                </ul>
              </div>     
            }
          </form>

          { /* LINKS */ } 
          <ul className="navbar-nav d-none d-lg-flex">
            <li className="nav-item">
              <a className="nav-link active" href="https://github.com/Emilianoac/que-paises-ha-vistado-luisito-comunica-react" target="_blank"><i className="fab fa-github"></i></a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container-fluid pb-5 pt-4">
        { /* ULTIMA ACTUALIZACION */ }
        <div className="row">
          <div className="col-12">
            <p className="text-end small mb-0">Última actualización <strong> 6 de Junio de 2023</strong> </p>
          </div>
        </div>

        { /* PROGRESO */ }
        <div className="row mt-4">
          <div className="col-12">
            <h1 className="text-center"><strong>Luisito Comunica</strong> ha visitado <strong>{ paisesVisistados.total.length }</strong> de 195 paises 🌎</h1>
            <span className="d-block"><strong> { paisesVisistados.total.length } / 195</strong> </span>
            <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar" style={{width: `${paisesVisistados.porcentaje}%` }}>
                <div className="d-flex align-items-center justify-content-end px-3">
                  <div className="progress-text">
                    <span>🧳✈️</span>
                    <span className="ms-2">{ paisesVisistados.porcentaje }%</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="small">
              * Para fines de esta pagina se cuentan como visitados aquellos paises que cuenten con 
              1 o más videos en su canal.
            </span>
          </div>
        </div>

        { /* LISTADO PAISES */ }
        <div className="listado-continentes mt-4">
            {paises.continentes.map(continente => (
              <div className="continente" key={continente.nombre}>
                <h2 className="continente-nombre">
                  <button onClick={() => handleToggle(continente.nombre)}>
                    { continente.nombre } 
                    <span><i className="fas fa-chevron-down"></i> </span> 
                  </button> 
                </h2>
                <span> {paisesVisistados[continente.nombre].length }</span> / <span>{ continente.paises.length  }</span>
                <ul id={`paises_${continente.nombre}`} className="paises mt-2">
                  {continente.paises.map(pais => (
                    <li key={pais.nombre}>
                      {pais.visitado ?
                        <a className="pais-content" href={pais.video}>
                          <p className="mb-0">
                            <img className="bandera me-2" src={ pais.bandera.imagen } />
                            { pais.nombre }
                          </p>
                          { pais.visitado && <i className="fas fa-check text-success"></i>}
                        </a>
                        :
                        <div className="pais-content" title="No visitado aún">
                          <p className="mb-0">
                            <img className="bandera me-2" src={ pais.bandera.imagen }/> 
                            { pais.nombre }
                          </p>
                          <i className="fas fa-times-circle text-danger"></i>
                        </div>
                      }
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </main>
  )
}

export default App
