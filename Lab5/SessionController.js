export default function SessionController(app){
    //整个 SessionController 会在你服务器启动时注册一个可以“写入 session 数据”的接口
    const setSession = (req, res) => {
        const name = req.params["name"];//从 URL 中提取名为 name 的路径参数
        const value = req.params["value"]; //提取名为 value 的路径参数
        req.session[name] = value; //把这个 name-value 键值对保存到 session 对象中
        res.send(req.session);//把当前的 session 对象作为响应返回给前端
    };
    const getSession = (req, res) =>{
        res.send(req.session);
    };
    const resetSession = (req,res) =>{
        req.session.destroy();
        res.send(200);
    }
    app.get("/api/session/set/:name/:value", setSession);//将路径参数 :name 和 :value 传给 setSession 函数，让它把数据存入 session 里。
    app.get("/api/session/get/:name", getSession);//读取 session 值
    app.get("/api/session/reset", resetSession);
    
}