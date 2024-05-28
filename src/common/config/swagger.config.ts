import { registerAs } from '@nestjs/config';

export default registerAs(
  'swagger',
  (): Record<string, any> => ({
    config: {
      info: {
        title: 'PDP Auth Aggregation',
        setDescription: `Deskripsi Agregasi Otentikasi (Authentication Aggregation)
        Agregasi Otentikasi adalah sebuah mekanisme yang digunakan untuk mengelola berbagai metode otentikasi dalam satu sistem secara terpadu. Dalam konteks aplikasi web atau API, agregasi otentikasi memungkinkan pengguna untuk mengautentikasi diri mereka menggunakan beberapa metode otentikasi seperti email dan kata sandi, OAuth (misalnya Google, Facebook), token API, atau bahkan autentikasi dua faktor (2FA).

        Manfaat Agregasi Otentikasi:
        - Kemudahan Penggunaan: Pengguna dapat memilih metode otentikasi yang paling nyaman bagi mereka.
        - Keamanan yang Ditingkatkan: Dengan mendukung autentikasi dua faktor dan token, keamanan aplikasi ditingkatkan.
        - Fleksibilitas: Memungkinkan pengembang untuk menambahkan atau mengubah metode otentikasi tanpa mengganggu pengalaman pengguna.
        - Sentralisasi Manajemen: Semua metode otentikasi dikelola di satu tempat, memudahkan administrasi dan pemeliharaan.

        Komponen Utama:
        - Strategi Otentikasi: Menggunakan berbagai strategi seperti LocalStrategy untuk email/kata sandi, JwtStrategy untuk token JWT, dan OAuthStrategy untuk otentikasi OAuth.
        - Guards: Mengamankan rute dan menentukan apakah pengguna memiliki izin yang diperlukan untuk mengakses sumber daya tertentu.
        - Decorators: Menghiasi rute dan parameter dengan informasi otentikasi yang relevan.
        - Middleware: Mengintersepsi dan memproses permintaan sebelum mencapai controller, misalnya untuk memverifikasi token JWT.`,
        setVersion: '1.0',
        setTermsOfService: 'https://example.com/terms',
        setContact: `'John Doe', 'john@example.com', 'https://example.com/contact'`,
        setLicense: `'MIT', 'https://example.com/license'`,
        // .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }),
        // .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }),
        // .addBasicAuth({ type: 'http', scheme: 'basic' }),
        // .addOAuth2({
        //   type: 'oauth2',
        //   flows: {
        //     implicit: { authorizationUrl: 'https://example.com/auth', scopes: {} },
        //   },
        // })
        addTag: `'Endpoints', 'Kumpulan endpoint aplikasi'`,
        // addServer('https://api.example.com', 'Production Server')
        // addServer('http://localhost:3000', 'Local Server')
      },
      swaggerUI: process.env.SWAGGER_ENABLED === 'true' ? true : false,
      documentationPath: '/auth/docs',
      documentationJson: '/auth/docs-json',
      swaggerPassword: process.env.SWAGGER_PASSWORD,
      swaggerUser: process.env.SWAGGER_USER,
    },
    options: {
      apisSorter: 'alpha',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    localUrl: process.env.SWAGGER_LOCAL_SERVER ?? 'http://localhost:3000',
    develompentUrl:
      process.env.SWAGGER_DEVELOPMENT_SERVER ?? 'https://example.com',
    productionUrl:
      process.env.SWAGGER_PRODUCTION_SERVER ?? 'https://example.com',
  }),
);
