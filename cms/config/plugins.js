module.exports = ({ env }) => ({
  // --- Upload des médias ---
  // Par défaut : stockage sur le disque (volume Docker `uploads`).
  // Pour utiliser Hetzner Object Storage (S3), installe
  //   npm i @strapi/provider-upload-aws-s3
  // puis décommente le bloc ci-dessous et renseigne les variables S3_* dans .env.
  //
  // upload: {
  //   config: {
  //     provider: 'aws-s3',
  //     providerOptions: {
  //       baseUrl: env('S3_CDN_URL'),
  //       s3Options: {
  //         credentials: {
  //           accessKeyId: env('S3_ACCESS_KEY_ID'),
  //           secretAccessKey: env('S3_ACCESS_SECRET'),
  //         },
  //         endpoint: env('S3_ENDPOINT'),
  //         region: env('S3_REGION'),
  //         params: { Bucket: env('S3_BUCKET') },
  //       },
  //     },
  //   },
  // },
});
