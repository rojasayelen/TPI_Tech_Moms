# .env - Configuración de entorno para Consultora de Idiomas

# Puerto del servidor
PORT=5000

# Cadena de conexión a MongoDB Atlas
# Reemplaza <usuario>, <password>, <cluster> y <dbname> con tus datos
#MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<dbname>ryWrites=tr?retue&w=majority

# MONGODB_URI=mongodb+srv://ayelenrojas:7Jr2HpSK2BmoHlyY@cluster0.prfbanm.mongodb.net/consultora_idiomas?retryWrites=true&w=majority&appName=Cluster0
# MONGODB_URI=mongodb+srv://daniela_h:eAxNNfCILce0X3Cn@cluster0.prfbanm.mongodb.net/consultora_idiomas?retryWrites=true&w=majority&appName=Cluster0
MONGODB_URI=mongodb+srv://ayeestudio_db_user:RvBrs7528yDezKvs@cluster0.yvftncc.mongodb.net/?appName=Cluster0


# Clave secreta para JWT (usa una clave fuerte en producción)
JWT_SECRET=linguaSecretKey
 
CLOUDINARY_CLOUD_NAME=drochq1qq
CLOUDINARY_API_KEY=292462339118983
CLOUDINARY_API_SECRET=102gdQnI16zhvLGVxcIlpd1-xh0
CLOUDINARY_UPLOAD_FOLDER=ppiv-consultora/courses

# Configuración de Firebase (si aplica)
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu_email@tu_project_id.iam.gserviceaccount.com

# Entorno de desarrollo
NODE_ENV=development

# Configuraciones adicionales
BCRYPT_ROUNDS=12