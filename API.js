
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Json File Path...
var filePath = './Data/data.json';

// Get Message Data...
app.get('/message/:id', (req, res) => {

    console.log('Id From Request', req.params.id)

     filePath = './Data/data.json';
    const data = fs.readFileSync(filePath, 'utf8');

    if (data) {

       // console.log('data', data);
        let fileData = JSON.parse(data);
        console.log('get Data..',fileData);

        const filterData = fileData.filter(function (item) {
            return item.id == req.params.id;
        });
        const mesdata = {
            "id": filterData[0].id,
            "title": filterData[0].title,
            "content": filterData[0].content,
            "datetime": filterData[0].datetime,
            "author": filterData[0].author,
        }

        res.send(mesdata)
    }

});

// Get Comments Data...
app.get('/message/:id/comments', (req, res) => {
     filePath = './Data/data.json';
    const data = fs.readFileSync(filePath, 'utf8');
    console.log('data', data);
    const fileData = JSON.parse(data);
    const filterData = fileData.filter(function (item) {
        return item.id == req.params.id;
    });
    console.log('datas...', filterData);
    let commentValue = {
        "comments": filterData[0].comments,
    }
    console.log('ReadFileSync');
    res.send(commentValue);

})


// Add Comments...
app.post('/message/:id/comments', (req, res) => {

     filePath = './Data/data.json';
    const data = fs.readFileSync(filePath, 'utf8');
    if (data) {
        let fileData = JSON.parse(data).message;
        console.log('req.params.id', req.params.id);

        if(fileData){

            fileData.forEach(item => {
                if (item.id == req.params.id) {
                    item.comments.push(req.body);
    
                    fs.writeFile(filePath, JSON.stringify(fileData), (err) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end();
                        } else {
                            let successMsg = {
                                status: 200,
                                message: "successfully updated... "
                            }
    
                            res.send(successMsg);
                        }
                    });
    
                }
            });
        }


    }

});

// Delete Comments...
app.delete('/message/:id/comment/:id', (req, res) => {
     filePath = './Data/data.json';
const data = fs.readFileSync(filePath,'utf8');
if (data) {
    const fileData = JSON.parse(data);
    const urlValue = req.url.split("/");
    const messageId = urlValue[2];


    console.log('message Id new',messageId, urlValue, fileData);
    if(fileData){

        fileData.forEach(item => {
            if (item.id == messageId) {
               // item.comments.push(req.body);
              let updatedData = item.comments.filter((item)=>{
                return item.commentid != req.params.id;
               })
                item.comments =updatedData;
                console.log('updated.. Value',updatedData);

                fs.writeFile(filePath, JSON.stringify(fileData), (err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end();
                    } else {
                        let successMsg = {
                            status: 200,
                            message: "successfully Deleted..."
                        }

                        res.send(successMsg);
                    }
                });

            }
        });
    }
}

});



// Testing API...
app.use('/', (req, res) => {
    console.log('Working Fine...');

    filePath = './Data/data.json';
    console.log('fillePath', filePath);
    res.send('Working Fine...');
})



app.listen(5001, (err) => {
    if (err) {
        throw err;
    } else {

        console.log('Server started on port 5001');
    }
})



