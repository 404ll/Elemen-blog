// import { useRequest } from 'ahooks';
// import { useState } from 'react'; 

// function SearchPage() {
//     const [keyword, setKeyword] = useState('');

//     const{
//         data,
//         loading,
//         error,
//         run ,
//         cancel
//     } = useRequest((searchText) => {
//         return fetch(`/api/search?q=${searchText}`).then(res => res.json());
//     },{
//         manual: true, // 手动触发请求
//         debounceWait: 500, // 防抖等待时间
//         loadingDelay: 300, // 加载延迟时间 - 避免闪烁
//         cacheKey: 'search-cache', // 缓存搜索结果
//         staleTime: 5 * 60 * 1000, // 缓存过期时间 - 5分钟

//         onSuccess: (data) => {
//             console.log('搜索成功:', data);
//         },

//         onError: (error) => {
//             console.error('搜索失败:', error);
//         }
//     });

//     const handleSearch = (e) => {
//         const value = e.target.value;
//         setKeyword(value);

//         if(value){
//             run(value); // 触发搜索请求
//         }else{
//             cancel(); // 取消请求（不会自动清空 data）
//         }
//     };

//     return (      
//       <div>
//         <input                                                                                                                                                  
//           value={keyword}                                                                                                                                       
//           onChange={handleSearch}                                                                                                                               
//           placeholder="搜索..."                                                                                                                                 
//         />                                                                                                                                                      
  
//         {loading && <p>搜索中...</p>}                                                                                                                           
//         {error && <p>搜索失败: {error.message}</p>}
                                                                                                                                                                
//         {data && (                                                                                                                                              
//           <ul>                                                                                                                                                  
//             {data.map(item => (                                                                                                                                 
//               <li key={item.id}>{item.title}</li>                                                                                                               
//             ))}                                                                                                                                                 
//           </ul>                                                                                                                                                 
//         )}                                                                                                                                                      
//       </div>                                                                                                                                                    
//     );            
// }  

// function OrderTracking({ orderId }) {
//     const { data, loading, cancel } = useRequest(                                                                                                               
//       () => fetch(`/api/order/${orderId}`).then(res => res.json()),                                                                                             
//       {                                                                                                                                                         
//         pollingInterval: 5000,        // 每5秒轮询一次                                                                                                          
//         pollingWhenHidden: false,     // 页面隐藏时停止                                                                                                         
                                                                                                                                                                
//         onSuccess: (data) => {                                                                                                                                  
//           // 订单完成后停止轮询                                                                                                                                 
//           if (data.status === 'delivered') {                                                                                                                    
//             cancel();                                                                                                                                           
//             message.success('订单已送达！');                                                                                                                    
//           }                                                                                                                                                     
//         },        
//       }                                                                                                                                                         
//     );            
                                                                                                                                                                
//     const statusMap = {                                                                                                                                         
//       pending: '待支付',
//       paid: '已支付',                                                                                                                                           
//       shipping: '配送中',                                                                                                                                       
//       delivered: '已送达',                                                                                                                                      
//     };                                                                                                                                                          
                                                                                                                                                                
//     return (                                                                                                                                                    
//       <div>       
//         <h3>订单 #{orderId}</h3>                                                                                                                                
//         {loading && <Spin />}                                                                                                                                   
//         {data && (                                                                                                                                              
//           <div>                                                                                                                                                 
//             <p>状态: {statusMap[data.status]}</p>                                                                                                               
//             <p>更新时间: {data.updateTime}</p>                                                                                                                  
//             {data.status !== 'delivered' && (                                                                                                                   
//               <Button onClick={cancel}>停止刷新</Button>                                                                                                        
//             )}                                                                                                                                                  
//           </div>                                                                                                                                                
//         )}                                                                                                                                                      
//       </div>      
//     );                                                                                                                                                          
//   }               