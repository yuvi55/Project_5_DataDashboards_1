import { useState } from "react";
import { useEffect } from "react";
import md5 from "blueimp-md5"

function Dashboard(){
    const publickey = 'b1cb39551462c02e72cf7011300cc810';
    const privatekey = '74d6dc2edc5050ac36918bd6f61f926fb8de092d';
    const ts = 2;
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    console.log(hash)
    const baseUrl = `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${publickey}&hash=${hash}`;

    //states definition for this program

    const[data,setData] = useState([]) ; 
    const[dataAll,setAllData] = useState([]) ; 
    const [filterText, setFilterText] = useState("");
    let data_req = []
    useEffect(() =>{
        async function get_api_data(){
            let response = await fetch(baseUrl) ;
            const data = await response.json() ;
            let main_req = data.data.results ;
            for(let i = 0 ; i < 20 ; i ++){
                data_req.push(main_req[i])
            }
            setData(data_req)
            setAllData(main_req)
        }

        get_api_data();

        
    },[])

    function filterData(){
            // Filter the data based on the filterText
            const filter_data = dataAll.filter((item) =>
              item.title.toLowerCase().includes(filterText.toLowerCase())
            );
          
            // Update the data state with the filtered results
            setData(filter_data);
    };


    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    return(
        <div style={{opacity:1}}>
            
            <input
            type="text"
            placeholder="Filter by Title"
            value={filterText}
            onChange={handleFilterChange}
            />
            <button onClick={()=>filterData()}>Search</button>
            
            <table>
                <thead>
                    <tr>
                        <th>Sr No.</th>
                        <th>Title</th>
                        <th>Page Count</th>
                        <th>Image</th>
                    </tr>
                </thead>
                    <tbody>
                    {
                    data.map((item, index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{item.title}</td>
                            <td>{item.pageCount}</td>
                            <td>
                                <img className="images"src = {item.images[0]?.path + "." + item.images[0]?.extension} alt="No Image found"></img>
                            </td>
                        
                        </tr>
                    ))
                }
                    
                </tbody>
            </table>
        </div>
    )

}

export default Dashboard