class SQL{
	
    constructor(plus){
		// 数据库名称一个软件只需要一个库这里写死
        this.name = 'sqlite_mine_sql';
        this.plus = plus;
		// 存储路径
		this.path = `_doc/sqlite_mine.db`;
    }

    initDatabase(){
        return new Promise((resolve , reject) => {
            const that = this;
            let sql = `SELECT count(*) FROM sqlite_master WHERE type='table' AND name= database`;
            that.plus.sqlite.executeSql({
                name: that.name,
                sql,
                success(data){
                    if(data === 0){
                        that.plus.sqlite.executeSql({
                            name: that.name,
                            sql: `create table if not exists database("value" TEXT,"time" CHAR(100),"chat_id" CHAR(50))`,
                            success(data){
                                resolve(data);
                            }
                        });
                    }else{
						resolve();
					}
                    console.log('initDatabase success: '+JSON.stringify(data));
                },
                fail(e){
                    that.plus.sqlite.executeSql({
                        name: that.name,
                        sql: `create table if not exists database("value" TEXT,"time" CHAR(100),"chat_id" CHAR(50))`,
                        success(data){
                            resolve(data);
                        }
                    });
					// reject();
                    console.log('initDatabase failed: '+JSON.stringify(e));
                }
            });
        })
    }
	
	// 连接数据库
    openDB(){
        return new Promise((resolve , reject)=>{
			if(this.isOpen()){
				return resolve();
			}
            this.plus.sqlite.openDatabase({
                name: this.name,
                path: this.path,
                success(data){
					console.log(`openDB success`,data)
                    resolve(data);
                },
                fail(e){
                    console.log('openDB failed: '+JSON.stringify(e));
                    reject(e);
                }
            });
        });
    }
	
	// 判断数据库是否打开
    isOpen(){
        return this.plus.sqlite.isOpenDatabase({
            name: this.name,
            path: this.path
        });
    }
	
	// 关闭数据库
    closeDB(){
        this.plus.sqlite.closeDatabase({
            name: this.name,
            success(e){
                console.log('closeDatabase success!');
            },
            fail(e){
                console.log('closeDatabase failed: '+JSON.stringify(e));
            }
        });
    }
	
	// 执行sql语句
    async handleSQL(handleType, options, isClose){
        await this.openDB();
        await this.initDatabase();
        switch(handleType){
            case 'insert':
                return this.insertSQL(options, isClose);
            case 'delete':
                return this.deleteSQL(options, isClose);
            case 'select':
                return this.selectSQL(options, isClose);
            default:
                throw new Error('没有这个操作！！！');
        }
    }
	
	// 插入sql语句
    insertSQL(options, isClose) {
		console.log('insert');
        const that = this;
        return new Promise((resolve , reject)=>{
            const sql = `insert into database values(${options.value},${options.time},${options.chat_id})`;
            that.plus.sqlite.executeSql({
                name: that.name,
                sql,
                success(data){
                    console.log('insertSQL success: '+JSON.stringify(data));
                    isClose && that.closeDB();
                    resolve(data);
                },
                fail(e){
                    console.log('insertSQL failed: '+JSON.stringify(e));
                    isClose && that.closeDB();
                    reject(e);
                }
            });
        });
    }
	
	// 删除sql语句
    deleteSQL(options, isClose){
        return new Promise((resolve , reject)=>{
            const that = that || this;
            const sql = options.time ? `delete from database where chat_id = ${options.chat_id}where time > ${options.time}`:`delete from database where chat_id = ${options.chat_id}`;
            that.plus.sqlite.executeSql({
                name: that.name,
                sql,
                success(data){
                    console.log('deleteSQL success: '+JSON.stringify(data));
                    isClose && that.closeDB();
                    resolve(data);
                },
                fail(e){
                    console.log('deleteSQL failed: '+JSON.stringify(e));
                    isClose && that.closeDB();
                    reject(e);
                }
            });
        });
    }
	
	// 查询sql语句
    selectSQL(options, isClose){
        return new Promise((resolve , reject)=>{
            const that = that || this; 
            const sql = `select * from database where chat_id = ${options.chat_id}`;
            that.plus.sqlite.selectSql({
                name: that.name,
                sql,
                success(data){
                    console.log('selectSQL success: '+JSON.stringify(data));
					if(options.hasOwnProperty('pageNum') && options.hasOwnProperty('pageSize')){
						let {pageNum,pageSize} = options;
						let total = data.length;
						let page = Math.ceil(total/pageSize);
						let req = {
							pageNum,
							pageSize,
							list:[],
							total
						};
						let startIndex = (pageNum - 1) * pageSize;
						if(pageNum<page){
							req.list = data.slice(startIndex,startIndex+pageSize);
							return resolve(req);
						}
					}else{
						resolve(data);
					}
                    isClose && that.closeDB();
                },
                fail(e){
                    console.log('selectSQL failed: '+JSON.stringify(e));
                    isClose && that.closeDB();
                    reject(e);
                }
            });
            
        });
    }
}

export default new SQL(plus);