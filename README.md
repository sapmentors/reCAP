# re-CAP

[re>≡CAP Conference Website](https://sapmentors.github.io/reCAP/)

## Contribute

To develop switch to the `docs-dev` folder, run `npm i` and then run `npm start`.

## Deployment

The deployment to GitHub Pages is automated using the GitHub action in `.github/workflows/build-deploy-recap.yml`. This action is executed when pushing to the `main` branch. The action will build the OpenUI5 application and push it to the branch `published-page`.
