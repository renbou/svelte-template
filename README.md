# Svelte template
Decent template for Svelte apps built with Vite.  

To create a new project using this template `degit` can be used:
```bash
degit renbou/svelte-template svelte-app
cd svelte-app
```

## How to
1. Install deps using `pnpm install` and run `pnpm start` to launch the `vite` dev server and `svelte-check` watcher.  

2. Compile and serve in production using `pnpm build` and `pnpm serve`. By default `serve` launches `sirv` in SPA mode, if the built app isn't an SPA then remove `--single` argument from the script.