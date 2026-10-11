# Vercel review hosting

Public review: https://attaulhaq-spatial-portfolio.vercel.app/ . This is the independent `attaulhaq-spatial-portfolio` project under `attaulhaq0s-projects`, separate from the creative portfolio and Hostinger.

The current deployment uses the verified static `dist/` artifact. No source, private review files, credentials, raw recordings or package caches are uploaded. The project uses Vercel's Other preset with no install/build step, clean URLs and trailing slashes. Compact footer attribution and exact font notices are included; there is no standalone Credits page.

From this workstation, `G:/Portfolio Website/Deploy-Portfolios.ps1 -Site spatial` performs check, build, acceptance tests and uploads a fresh artifact to the explicitly linked project, with process caches and temporary files on G:. `G:/Portfolio Website/VERCEL-REVIEWS.md` maps both independent projects. GitHub pushes alone do not redeploy this artifact-based setup. The script uses existing CLI authentication and stores no credentials.

Use the stable domain for friend review; unique deployment domains retain standard Vercel protection. Verify the public domain anonymously after each deployment, including homepage, project routes, model readiness, CV and native media playback. A READY deployment alone does not prove those interactions.
