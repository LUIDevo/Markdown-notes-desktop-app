export default function TopBar(selectednote) {
    let bibby = selectednote.title
    console.log(bibby)
    const clicked = () => {
        console.log(bibby)
    }
    return(
        <>
            
            {
                bibby ? 
            <div className="">
                {bibby.map((bib, index) => (
                    <div>{{bib}}</div>
                ))}
                ssdasdasdsaasd
            </div>
            :
            <div style={{color: "white"}}>nothing</div>
            }
            
            <button onClick={clicked}>Click me</button>
        </>
    )
}