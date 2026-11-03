import { oauthSignInAction } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { GithubIcon, GoogleIcon } from "@/components/shared/brand-icons";

interface OAuthButtonsProps {
  callbackUrl?: string;
}

export function OAuthButtons({ callbackUrl }: OAuthButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <form action={oauthSignInAction.bind(null, "github", callbackUrl)}>
          <SubmitButton variant="outline" className="w-full">
            <GithubIcon className="size-4" />
            GitHub
          </SubmitButton>
        </form>
        <form action={oauthSignInAction.bind(null, "google", callbackUrl)}>
          <SubmitButton variant="outline" className="w-full">
            <GoogleIcon className="size-4" />
            Google
          </SubmitButton>
        </form>
      </div>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        Or with email
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}