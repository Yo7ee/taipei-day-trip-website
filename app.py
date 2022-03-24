from flask import *
import mysql.connector
import data.config as config
#For coonnection pool
from mysql.connector import pooling
pool=pooling.MySQLConnectionPool

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.secret_key="abc" #For session

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

#connect pooling
connectionPool=pool(
	pool_name="mysqlpool",
	pool_size=10,
	pool_reset_session=True,#reset session varialbes when the connection is returned to the pool
	host=config.mysql["host"],
	user=config.mysql["user"],
	password=config.mysql["password"],
	database="taipeiAttraction",
	)


@app.route("/api/attractions/", methods=["GET"])
def page():
	mydb=connectionPool.get_connection()
	keyword=request.args.get("keyword")
	# print(type(getData)) #資料型態list
	page=request.args.get("page") #request.args.get得到的值為str, 為了計算使用int，轉換為int	
	page=int(page)
	x=page*12
	mycursor=mydb.cursor()
	pageList=[]
	try:
		if(keyword==None):
			mycursor=mydb.cursor()
			mycursor.execute("SELECT * FROM attraction LIMIT %s,12",(x,))
			getData=mycursor.fetchall()
			if(len(getData) % 12 ==0 and len(getData)!=0): #當資料小於12或是沒有資料時，nextPage=null
				page=page+1
			else:
				page=None			
			# print(range(len(getData)))
			for j in range(len(getData)):
				result={
				"id":getData[j][0], 
				"name":getData[j][1],
				"category":getData[j][2],
				"description":getData[j][3],
				"address":getData[j][4],
				"transport":getData[j][5],
				"mrt":getData[j][6],
				"latitude":getData[j][7],
				"longitude":getData[j][8],
				"images":getData[j][9].split(","),#處理圖片位址str to list
				}
				pageList.append(result)
			result={"nextPage":page,"data":pageList}
			return jsonify(result)
		elif(type(keyword)==str):
			keyword='%'+keyword+'%' #模糊查詢結構
			mycursor=mydb.cursor()
			mycursor.execute("SELECT * FROM attraction WHERE name LIKE %s LIMIT %s,12",(keyword, x,))
			getData=mycursor.fetchall()
			if(len(getData) % 12 ==0 and len(getData)!=0):
				page=page+1
			else:
				page=None
			for j in range(len(getData)):
				result={
				"id":getData[j][0], 
				"name":getData[j][1],
				"category":getData[j][2],
				"description":getData[j][3],
				"address":getData[j][4],
				"transport":getData[j][5],
				"mrt":getData[j][6],
				"latitude":getData[j][7],
				"longitude":getData[j][8],
				"images":getData[j][9].split(","),#處理圖片位址str to list
				}
				pageList.append(result)
			result={"nextPage":page,"data":pageList}
			return jsonify(result)
	except:
		errorMes={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(errorMes)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

@app.route("/api/attraction/<id>", methods=["GET"])
def attractionId(id):
	mydb=connectionPool.get_connection() 	
	try:
		mycursor=mydb.cursor()
		mycursor.execute("SELECT * FROM attraction WHERE id= %s",(id,))
		getData=mycursor.fetchall()
		result={
			"data":{
			"id":getData[0][0], 
			"name":getData[0][1],
			"category":getData[0][2],
			"description":getData[0][3],
			"address":getData[0][4],
			"transport":getData[0][5],
			"mrt":getData[0][6],
			"latitude":getData[0][7],
			"longitude":getData[0][8],
			"images":getData[0][9].split(","),#處理圖片位址str to list
			}
		}
		return jsonify(result)
	except IndexError:
		errorMes={
			"error":True,
			"message":"景點編號錯誤"
		}
		return jsonify(errorMes)
	except:
		errorMes={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(errorMes)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

@app.route("/api/user", methods=["GET"])
def checkName():
	try:
		mydb=connectionPool.get_connection()
		mycursor=mydb.cursor()
		email=session.get("email")
		print(session)
		print('email' in session)
		if 'email' in session:
			mycursor.execute("SELECT id, name, email from member WHERE email=%s", (email,))
			getData=mycursor.fetchall()
			print(getData[0][0])
			result={
				"data":{
					"id":getData[0][0],
					"name":getData[0][1],
					"email":getData[0][2]
				}
			}
			return jsonify(result)
		else:
			print(email)
			result={
				"data":None
			}
			return jsonify(result)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

@app.route("/api/user", methods=["POST"])
def signup():
	Name=request.form["name"]
	Email=request.form["email"]
	Password=request.form["password"]

	mydb=connectionPool.get_connection()
	mycursor=mydb.cursor()
	mycursor.execute("SELECT email from member WHERE email=%s", (Email,))
	checkEmail=mycursor.fetchall()
	print("name:"+Name)
	print("Email:"+Email)
	print("password:"+Password)
	print(Email=="")
	print(checkEmail)
	print(Email in str(checkEmail))

	try:
		if Name=="" or Email=="" or Password=="":
			result={
				"error":True,
				"message":"姓名或email或密碼不可為空"
			}
			return jsonify(result, 400)
		elif Email in str(checkEmail):
			result={
				"error":True,
				"message":"email已被註冊"
			}
			return jsonify(result, 400)
		else:
			sql="INSERT INTO member(name, email, password) VALUES(%s, %s, %s)"
			val=(Name, Email, Password)
			mycursor.execute(sql, val)
			mydb.commit()
			print(mycursor.rowcount, "record inserted.")
			result={
				"ok":True,
				"message":"註冊成功"
			}
			return jsonify(result, 200)
	except:
		result={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(result, 500)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

@app.route("/api/user", methods=["PATCH"])
def signin():
	email=request.form["email"]
	password=request.form["password"]
	mydb=connectionPool.get_connection()
	mycursor=mydb.cursor()
	mycursor.execute("SELECT name FROM member WHERE email=%s and password=%s", (email,password))
	userCheck=mycursor.fetchall()
	try:
		if userCheck==[]:
			condition="未登入"
			session["status"]=condition
			result={
				"error":True,
				"message":"帳號、或密碼輸入錯誤"
			}
			return jsonify(result, 400)
		elif email=="" or password=="":
			condition="未登入"
			session["status"]=condition
			result={
				"error":True,
				"message":"帳號、或密碼不可空白"
			}
			return jsonify(result, 400)
		else:
			condition="已登入"
			session["status"]=condition
			session["email"]=email
			session["password"]=password
			result={
				"ok":True
			}
			return jsonify(result, 200)
	except:
		result={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(result, 500)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

@app.route("/api/user", methods=["DELETE"])
def logout():
	session.pop("email", None)
	session["status"]="未登入"
	result={
		"ok":True
	}
	return result



app.run(host='0.0.0.0', port=3000, debug=True)