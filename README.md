# Input

## Install

```console
npm install @prof-dev/input
```

## Usage

```html
<div class="input">
  <div class="input-container">
    <input class="input-field" type="email" name="email" />
    <div class="input-label">Email</div>
  </div>
</div>

<div class="input">
  <div class="input-container">
    <textarea class="input-field" rows="3" data-max-rows="7"></textarea>
    <div class="input-label">Textarea</div>
  </div>
</div>

<div class="input is-error is-active">
  <div class="input-container">
    <input
      class="input-field"
      type="email"
      name="email"
      value="value"
      required=""
    />
    <div class="input-label">Required with error &amp; value</div>
  </div>
  <div class="input-error">
    <div class="error-inner">Wrong value error message</div>
  </div>
</div>
```

```typescript
import { Input } from "@prof-dev/input";

Input.initAllAvailableOnPage();
```
