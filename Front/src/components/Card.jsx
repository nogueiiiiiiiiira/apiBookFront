import style from './Card.module.css'

export default function Card(props){
    return(
          <div className={style.wrapCard}>
            <div className={style.Card}>
              <h2 className={style.cardTitle}>{props.nome}</h2>
              <br />
              <div className={style.cardBody}>
                <div className={style.cardText}>
                    <p>{props.id}</p>
                    <p>{props.autor}</p>
                    <p>{props.categoria}</p>
                    <p>{props.estoque}</p>
                </div>
              </div>
            </div>
          </div>
    )
}
