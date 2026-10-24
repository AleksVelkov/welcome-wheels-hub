<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep the frontend-only Carpool guest experience at the TanStack index route; the source repository’s production backend is outside this redesign’s scope.
- Store translated homepage copy and canonical city options in a browser-safe content module so English and Macedonian share one interface.
- Define page colors, shadows and responsive mobile-first styles in the global stylesheet; controls use the existing design-system components.
