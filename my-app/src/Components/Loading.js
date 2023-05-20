import LoadingCSS from '../Styles/Loading.module.css';

function Loading() {
    return (
        <div className= {LoadingCSS.loader_container}>
            <div className={LoadingCSS.loader}></div>
            <div className={LoadingCSS.loader_text}> 
              Loading
            <br></br>
              <div className={LoadingCSS.loader_subtext}>If loading is slow, try less categories.</div>
            </div>
        </div>
    )
}

export default Loading;