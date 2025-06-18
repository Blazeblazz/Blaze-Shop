# Instructions for Pushing to GitHub and Setting Up Custom Domain

Follow these steps to push your website to GitHub and set up your custom domain:

## 1. Create a GitHub Repository
1. Go to https://github.com/new
2. Name your repository (e.g., "blaze-shop")
3. Make it Public
4. Click "Create repository"

## 2. Push Your Code to GitHub
Open a terminal/command prompt and run:

```bash
cd c:\Users\&\OneDrive\Desktop\Showroom
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blaze-shop.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 3. Set Up GitHub Pages
1. Go to your repository on GitHub
2. Click on "Settings"
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/" (root) folder
6. Click "Save"

## 4. Configure Custom Domain
1. In GitHub repository settings > Pages
2. Under "Custom domain", enter: blazeblazz.store
3. Click "Save"
4. Check "Enforce HTTPS" once the certificate is ready

## 5. Set Up DNS Records
At your domain registrar (where you purchased blazeblazz.store), add these records:

```
Type    Name             Value
A       @               185.199.108.153
A       @               185.199.109.153
A       @               185.199.110.153
A       @               185.199.111.153
CNAME   www             YOUR_USERNAME.github.io
```

Replace `YOUR_USERNAME` with your GitHub username.

## 6. Wait for DNS Propagation
It may take up to 24 hours for DNS changes to propagate. Once complete, your website will be available at https://blazeblazz.store

## Note
The CNAME file has already been created in your repository with the content:
```
blazeblazz.store
```

This file tells GitHub Pages which domain to use for your site.