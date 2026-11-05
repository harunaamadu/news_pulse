import { oauthSignInAction } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { GithubIcon, GoogleIcon } from "@/components/shared/brand-icons";
import { Marker, MarkerContent } from "../ui/marker";

interface OAuthButtonsProps {
  callbackUrl?: string;
}

const hasGithub = Boolean(
  process.env.AUTH_GITHUB_ID?.trim() && process.env.AUTH_GITHUB_SECRET?.trim(),
);
const hasGoogle = Boolean(
  process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim(),
);

export function OAuthButtons({ callbackUrl }: OAuthButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <form action={oauthSignInAction.bind(null, "github", callbackUrl)}>
          <SubmitButton
            variant="outline"
            className="w-full"
            disabled={!hasGithub}
            title={hasGithub ? undefined : "GitHub sign-in is not configured"}
          >
            <GithubIcon className="size-4" />
            GitHub
          </SubmitButton>
        </form>
        <form action={oauthSignInAction.bind(null, "google", callbackUrl)}>
          <SubmitButton
            variant="outline"
            className="w-full"
            disabled={!hasGoogle}
            title={hasGoogle ? undefined : "Google sign-in is not configured"}
          >
            <GoogleIcon className="size-4" />
            Google
          </SubmitButton>
        </form>
      </div>

      <Marker variant="separator">
        <MarkerContent className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">
          Or with email
        </MarkerContent>
      </Marker>
    </div>
  );
}